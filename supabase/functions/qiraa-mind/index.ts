import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-auth-token",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, user_file } = await req.json();
    const userToken = req.headers.get("x-auth-token");
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. التحقق من هوية المستخدم ورصيد الأسئلة
    let userId: string | null = null;
    let isAdmin = false;
    if (userToken) {
        const { data: { user } } = await supabase.auth.getUser(userToken);
        if (user) {
            userId = user.id;
            const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin');
            isAdmin = !!(roles && roles.length > 0);

            if (!isAdmin) {
                const { data: profile } = await supabase.from('profiles').select('qiraa_mind_tokens, subscription_plan').eq('user_id', userId).single();
                
                // Enforce subscription plan: only pro/enterprise allowed
                const plan = profile?.subscription_plan?.toLowerCase() || 'free';
                if (!['pro', 'enterprise'].includes(plan)) {
                    return new Response(JSON.stringify({ error: "Access restricted to Pro and Enterprise plans." }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
                }
                
                if (!profile || profile.qiraa_mind_tokens <= 0) {
                    return new Response(JSON.stringify({ error: "Insufficient tokens" }), { status: 402, headers: corsHeaders });
                }
            }
        }
    }

    // 2. تحليل لغة السؤال لاختيار عمود المقالات
    const lastUserMessage = messages[messages.length - 1].content;
    const isArabic = /[\u0600-\u06FF]/.test(lastUserMessage);
    const contentColumn = isArabic ? "content_ar" : "content_en";

    // 3. تحديد النطاق الزمني للمقالات (آخر 3 أشهر فقط)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const dateLimit = threeMonthsAgo.toISOString();

    let knowledgeBase = "";
    let totalChars = 0;
    const MAX_KB_CHARS = 800000; 

    // 4. سحب المقالات اللحظية (Articles) — PRIORITY 1: DB sources first
    try {
      const { data: analyticsData } = await supabase
        .from("analytics")
        .select(`${contentColumn}, published_at`)
        .gte("published_at", dateLimit)
        .order("published_at", { ascending: false });

      if (analyticsData && analyticsData.length > 0) {
        knowledgeBase += "=== RECENT MARKET ANALYSES (LAST 3 MONTHS) ===\n";
        for (const art of analyticsData) {
          const textContent = (art as any)[contentColumn];
          if (!textContent) continue;

          const entry = `\n[Published: ${new Date(art.published_at!).toLocaleDateString()}] \n${textContent}\n`;
          if (totalChars + entry.length < MAX_KB_CHARS) {
            knowledgeBase += entry;
            totalChars += entry.length;
          }
        }
      }
    } catch (e) { console.error("Error fetching articles:", e); }

    // 5. سحب المستندات والتقارير المرفوعة يدوياً (qiraa_mind_documents) — PRIORITY 2
    try {
      const { data: staticDocs } = await supabase
        .from("qiraa_mind_documents")
        .select("title, content, source_month, source_year, document_type")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (staticDocs && staticDocs.length > 0) {
        knowledgeBase += "\n=== STATIC REFERENCE DOCUMENTS ===\n";
        for (const doc of staticDocs) {
          const entry = `\n[Document: ${doc.title} | ${doc.source_month || ''} ${doc.source_year || ''} | Type: ${doc.document_type || 'general'}]\n${doc.content}\n`;
          if (totalChars + entry.length < MAX_KB_CHARS) {
            knowledgeBase += entry;
            totalChars += entry.length;
          }
        }
      }
    } catch (e) { console.error("Error fetching documents:", e); }

    // 6. ملف المستخدم المرفق — PRIORITY 3 (lowest, after DB sources)
    if (user_file && user_file.content) {
      let userFileText = "";
      const fileContent = user_file.content as string;
      const fileName = user_file.name || "unknown";

      // Check if it's a base64-encoded file (PDF/DOCX)
      if (fileContent.startsWith("[BASE64_FILE:")) {
        // Extract the base64 content after the header
        const headerEnd = fileContent.indexOf("]");
        const base64Data = fileContent.slice(headerEnd + 1);
        const headerInfo = fileContent.slice(1, headerEnd);
        const fileType = headerInfo.split(":")[2] || "";

        // For PDFs, use AI to extract text
        if (fileType.includes("pdf")) {
          try {
            const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-2.5-flash",
                messages: [
                  {
                    role: "user",
                    content: [
                      { type: "text", text: "Extract ALL text content from this PDF document. Return ONLY the raw text, preserving the structure. Do not summarize." },
                      { type: "image_url", image_url: { url: `data:application/pdf;base64,${base64Data}` } }
                    ]
                  }
                ],
              }),
            });
            if (aiResponse.ok) {
              const aiData = await aiResponse.json();
              userFileText = aiData.choices?.[0]?.message?.content || `[فشل استخراج نص الـ PDF: ${fileName}]`;
            }
          } catch (e) {
            console.error("PDF extraction error:", e);
            userFileText = `[فشل استخراج نص الـ PDF: ${fileName}]`;
          }
        } else {
          userFileText = `[ملف ثنائي مرفق: ${fileName} - النوع غير مدعوم للاستخراج التلقائي]`;
        }
      } else {
        // Plain text content
        userFileText = fileContent;
      }

      // Append user file ONLY if there's room left
      if (userFileText && totalChars + userFileText.length < MAX_KB_CHARS) {
        knowledgeBase += `\n=== USER-UPLOADED FILE (Lower Priority - Unverified) ===\n`;
        knowledgeBase += `[File: ${fileName}]\n${userFileText}\n`;
        totalChars += userFileText.length;
      } else if (userFileText) {
        // Truncate to fit remaining space
        const remaining = MAX_KB_CHARS - totalChars - 200;
        if (remaining > 500) {
          knowledgeBase += `\n=== USER-UPLOADED FILE (Lower Priority - Unverified - TRUNCATED) ===\n`;
          knowledgeBase += `[File: ${fileName}]\n${userFileText.slice(0, remaining)}\n[... TRUNCATED]\n`;
          totalChars = MAX_KB_CHARS;
        }
      }
    }

    if (totalChars === 0) {
        knowledgeBase = "لا توجد بيانات متاحة للإجابة.";
    }

    // 7. البرومبت النظامي 
    const systemPrompt = `### ROLE
You are "QIRAA MIND," a proprietary Strategic Market Intelligence Engine. You are a sharp, data-driven analyst for VCs and founders in the MENA startup ecosystem.

### STRICT DATA SOURCE
Answer ONLY based on the text extracted from the database below (which includes live articles, static reports, and optionally a user-uploaded file).
- Database sources (articles & static documents) are TRUSTED and take PRIORITY.
- User-uploaded files are SECONDARY and UNVERIFIED. Use them as supplementary context only. If they conflict with database sources, prefer database sources.
- If data is missing, state: "// SIGNAL MISSING: Data point is out of my role."
- DO NOT hallucinate. DO NOT use outside knowledge.
- For Arabic queries, answer in Business Arabic. For English, use Business English.

### RESPONSE FORMAT (The "Briefing" Style)

1. **THE BOTTOM LINE:** A single, decisive summary sentence.

2. **THE DATA:** Bullet points with **Bold** numbers/percentages and specific deal names.

3. **THE STRATEGIC IMPLICATION:** Why this matters for an investor or founder. One powerful sentence.

### TONE

- **No Fluff:** No "Hello," "Sure," "Here is the info," or any greeting.

- **Language:** Match the user's language (Formal Arabic or Business English).

- **Style:** Executive, Sharp, Analytical. Every word must earn its place.

### KNOWLEDGE BASE:
${knowledgeBase}`;

    // 8. الاتصال بمحرك Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "الضغط عالي، يرجى المحاولة بعد قليل." }), { status: 429, headers: corsHeaders });
      if (response.status === 402) return new Response(JSON.stringify({ error: "رصيد الـ API نفد." }), { status: 402, headers: corsHeaders });
      return new Response(JSON.stringify({ error: "Gateway error" }), { status: 500, headers: corsHeaders });
    }

    // 9. خصم التوكن بعد نجاح الاتصال (الأدمن معفى)
    if (userId && !isAdmin) {
        const { data: profile } = await supabase.from('profiles').select('qiraa_mind_tokens').eq('user_id', userId).single();
        if (profile) {
            await supabase.from('profiles').update({ qiraa_mind_tokens: profile.qiraa_mind_tokens - 1 }).eq('user_id', userId);
        }
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});
