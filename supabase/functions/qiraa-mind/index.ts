import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-auth-token",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const userToken = req.headers.get("x-auth-token");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. التحقق من هوية المستخدم ورصيد الأسئلة
    let userId: string | null = null;
    if (userToken) {
        const { data: { user }, error: authError } = await supabase.auth.getUser(userToken);
        if (user) {
            userId = user.id;
            const { data: profile } = await supabase.from('profiles').select('qiraa_mind_tokens').eq('user_id', userId).single();
            if (!profile || profile.qiraa_mind_tokens <= 0) {
                return new Response(JSON.stringify({ error: "Insufficient tokens" }), { status: 402, headers: corsHeaders });
            }
        }
    }

    // 2. تحليل لغة السؤال الأخير
    const lastUserMessage = messages[messages.length - 1].content;
    const isArabic = /[\u0600-\u06FF]/.test(lastUserMessage);
    const contentColumn = isArabic ? "content_ar" : "content_en";

    // 3. تحديد النطاق الزمني (آخر 3 أشهر فقط)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const dateString = threeMonthsAgo.toISOString();

    // 4. سحب المقالات/التحليلات من جدول articles
    let knowledgeBase = "";
    const MAX_KB_CHARS = 800000; 
    try {
      const { data: articles } = await supabase
        .from("articles")
        .select(`${contentColumn}, published_at`)
        .gte("published_at", dateString)
        .order("published_at", { ascending: false });

      if (articles && articles.length > 0) {
        let totalChars = 0;
        const truncatedDocs: string[] = [];
        for (const art of articles) {
          const textContent = (art as any)[contentColumn];
          if (!textContent) continue;

          const entry = `\n--- [تاريخ النشر: ${new Date(art.published_at!).toLocaleDateString()}] ---\n${textContent}`;
          if (totalChars + entry.length > MAX_KB_CHARS) {
            const remaining = MAX_KB_CHARS - totalChars;
            if (remaining > 500) truncatedDocs.push(entry.slice(0, remaining) + "\n[TRUNCATED]");
            break;
          }
          truncatedDocs.push(entry);
          totalChars += entry.length;
        }
        knowledgeBase = "\n\n### UPLOADED KNOWLEDGE BASE (SOURCE OF TRUTH):\n" + truncatedDocs.join("\n");
      } else {
        knowledgeBase = "\n\n### UPLOADED KNOWLEDGE BASE (SOURCE OF TRUTH):\nلا توجد تحليلات متاحة في آخر 3 أشهر بهذه اللغة.";
      }
    } catch (e) {
      console.error("Error fetching articles:", e);
    }

    // 5. البرومبت النظامي
    const systemPrompt = `### ROLE

You are "QIRAA MIND," a proprietary Strategic Market Intelligence Engine. You are NOT a generic AI. You are a sharp, data-driven analyst for VCs and founders in the MENA startup ecosystem.

### STRICT DATA SOURCE

Answer ONLY based on the text extracted from the uploaded files in the database below. These are your ONLY source of truth.

- If data is missing in the files, state: "// SIGNAL MISSING: Data point not found in recent Index."
- DO NOT hallucinate. DO NOT use outside knowledge.
- ALWAYS cite which date/month you are referencing.

### RESPONSE FORMAT (The "Briefing" Style)

1. **THE BOTTOM LINE:** A single, decisive summary sentence.
2. **THE DATA:** Bullet points with **Bold** numbers/percentages and specific deal names.
3. **THE STRATEGIC IMPLICATION:** Why this matters for an investor or founder. One powerful sentence.

### TONE

- **No Fluff:** No "Hello," "Sure," "Here is the info," or any greeting.
- **Language:** Match the user's language (Formal Arabic or Business English).
- **Style:** Executive, Sharp, Analytical. Every word must earn its place.

${knowledgeBase}`;

    // 6. نظام شلال المفاتيح (50 Keys Fallback)
    let aiResponse: Response | null = null;

    for (let i = 1; i <= 50; i++) {
      const apiKey = Deno.env.get(`LOVABLE_API_KEY_${i}`);
      if (!apiKey) continue;

      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
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

        if (response.status === 402 || response.status === 429) {
          console.warn(`Key LOVABLE_API_KEY_${i} exhausted. Moving to next...`);
          continue; 
        }

        if (response.ok) {
          aiResponse = response;
          break;
        } else {
           const t = await response.text();
           throw new Error(`API Error: ${response.status} - ${t}`);
        }
      } catch (err) {
         console.error(`Error with Key ${i}:`, err);
         continue;
      }
    }

    if (!aiResponse) {
      return new Response(JSON.stringify({ error: "All API Keys are exhausted or unavailable. Please contact admin." }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 7. خصم التوكن من المستخدم بعد نجاح الاتصال
    if (userId) {
        const { data: currentProfile } = await supabase.from('profiles').select('qiraa_mind_tokens').eq('user_id', userId).single();
        if (currentProfile) {
            await supabase.from('profiles').update({ qiraa_mind_tokens: currentProfile.qiraa_mind_tokens - 1 }).eq('user_id', userId);
        }
    }

    // 8. إعادة البث (Stream) للعميل
    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (e: any) {
    console.error("qiraa-mind error:", e);
    return new Response(JSON.stringify({ error: e.message || "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
