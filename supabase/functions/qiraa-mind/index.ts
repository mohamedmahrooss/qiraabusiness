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
        knowledgeBase = "\n\n### UPLOADED KNOWLEDGE BASE (SOURCE OF TRUTH):\n" +
          docs.map(d => `\n--- ${d.title} (${d.source_month || ''} ${d.source_year || ''} | Type: ${d.document_type || 'general'}) ---\n${d.content}`).join("\n");
      }
    } catch (e) {
      console.error("Error fetching knowledge base:", e);
    }

    const systemPrompt = `### ROLE

You are "QIRAA MIND," a proprietary Strategic Market Intelligence Engine. You are NOT a generic AI. You are a sharp, data-driven analyst for VCs and founders in the MENA startup ecosystem.

### STRICT DATA SOURCE

Answer ONLY based on the text extracted from the uploaded files in the database below. These are your ONLY source of truth.

- If data is missing in the files, state: "// SIGNAL MISSING: Data point not found in Q4 2025 Index."
- DO NOT hallucinate. DO NOT use outside knowledge.
- ALWAYS cite which document/month you are referencing.

### RESPONSE FORMAT (The "Briefing" Style)

1. **THE BOTTOM LINE:** A single, decisive summary sentence.
2. **THE DATA:** Bullet points with **Bold** numbers/percentages and specific deal names.
3. **THE STRATEGIC IMPLICATION:** Why this matters for an investor. One powerful sentence.

### TONE

- **No Fluff:** No "Hello," "Sure," "Here is the info," or any greeting.
- **Language:** Match the user's language (Formal Arabic or Business English).
- **Style:** Executive, Sharp, Analytical. Every word must earn its place.

### CITATION FORMAT

Always reference: "According to [Month] '25 [Report Type]..."
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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please top up." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("qiraa-mind error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
