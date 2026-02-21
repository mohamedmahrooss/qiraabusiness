import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-auth-token",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured in Supabase Secrets");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. جلب أحدث الملفات النشطة من الجدول
    const { data: docs, error: dbError } = await supabase
      .from("qiraa_mind_documents")
      .select("file_url, title")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (dbError) throw dbError;

    // 2. تحويل ملفات الـ PDF إلى صيغة يفهمها Gemini (Base64)
    const fileParts = await Promise.all((docs || []).map(async (doc) => {
      try {
        const res = await fetch(doc.file_url);
        const arrayBuffer = await res.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return {
          inlineData: { data: base64, mimeType: "application/pdf" }
        };
      } catch (e) {
        console.error(`Failed to load file: ${doc.title}`, e);
        return null;
      }
    }));

    const validFileParts = fileParts.filter(part => part !== null);

    // 3. بناء الرسالة الموجهة لـ Gemini
    const systemInstruction = `You are "QIRAA MIND," a Strategic Market Intelligence Engine for MENA.
    STRICT RULES:
    1. Use ONLY the provided PDF documents to answer.
    2. Be extremely precise with percentages and numbers from tables.
    3. Format: BOTTOM LINE (1 sentence), THE DATA (bullet points), STRATEGIC IMPLICATION (1 sentence).
    4. Language: If the user asks in Arabic, respond in Professional Arabic.
    5. No fluff or greetings.`;

    const lastUserMessage = messages[messages.length - 1].content;

    // 4. الاتصال المباشر بـ Gemini API لدعم الـ Streaming
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:streamGenerateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: systemInstruction },
              ...validFileParts,
              { text: lastUserMessage }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topP: 0.95,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${errorText}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (e) {
    console.error("Error in qiraa-mind function:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
