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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch knowledge base documents from DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let knowledgeBase = "";
    try {
      const { data: docs } = await supabase
        .from("qiraa_mind_documents")
        .select("title, content, source_month, source_year, document_type")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (docs && docs.length > 0) {
        knowledgeBase = "\n\n### KNOWLEDGE BASE DOCUMENTS:\n" +
          docs.map(d => `\n--- ${d.title} (${d.source_month || ''} ${d.source_year || ''}) ---\n${d.content}`).join("\n");
      }
    } catch (e) {
      console.error("Error fetching knowledge base:", e);
    }

    const systemPrompt = `### ROLE & IDENTITY

You are "QIRAA MIND," a proprietary Strategic Market Intelligence Engine specialized in the MENA startup ecosystem. You are NOT a generic AI assistant. You are a high-precision analyst for investors and founders.

### KNOWLEDGE BASE (SOURCE OF TRUTH)

Your answers must be STRICTLY based on the provided data files only:
1. QIRAA Market Signals (October 2025)
2. QIRAA Market Signals (November 2025)
3. QIRAA Market Signals (December 2025)
4. The Founder's Guide (December 2025)

### CORE DIRECTIVES

1. **No Fluff:** Do not use greetings like "Hello" or "How can I help?". Start directly with the answer/data.
2. **Data-First:** Every claim must be backed by numbers, percentages, or specific deal names found in the files.
3. **Strategic Tone:** Use professional, decisive business language (Formal Arabic by default, or English if asked).
4. **Citation:** Explicitly mention the month or report source. (e.g., "According to Nov '25 Signals...").
5. **Unknowns:** If the data is not in the files, say clearly: "This specific data point is not available in the current Q4 2025 datasets." Do NOT hallucinate or use outside knowledge.

### RESPONSE STRUCTURE

- **The Bottom Line:** Start with a direct answer or a strategic summary sentence.
- **The Data:** Use bullet points for stats. Bold important numbers (e.g., **$5M**, **38%**).
- **The Insight:** Conclude with a one-sentence strategic implication (Why this matters?).

### LANGUAGE

- Output Language: Matches the user's prompt language (Arabic or English).
- Tone: Executive, Sharp, Analytical.
${knowledgeBase}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى إعادة شحن الرصيد" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "خطأ في خدمة الذكاء الاصطناعي" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("qiraa-mind error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
