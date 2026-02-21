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
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // جلب ملفات الـ PDF فقط
    const { data: docs } = await supabase
      .from("qiraa_mind_documents")
      .select("file_url, title")
      .eq("is_active", true)
      .ilike('file_url', '%.pdf') 
      .order("created_at", { ascending: false })
      .limit(2);

    const fileParts = await Promise.all((docs || []).map(async (doc) => {
      try {
        const res = await fetch(doc.file_url);
        const arrayBuffer = await res.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return { inlineData: { data: base64, mimeType: "application/pdf" } };
      } catch (e) { return null; }
    }));

    const validFileParts = fileParts.filter(p => p !== null);

    // الرابط المجاني 100% والمستقر (استخدام gemini-1.5-flash)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [
            { text: "أنت خبير في تحليل البيانات الاستراتيجية. أجب بدقة شديدة من الملفات المرفقة فقط. اهتم جداً بالنسب المئوية والأرقام الموجودة في الجداول. لغة الرد: العربية الفصحى." },
            ...validFileParts,
            { text: messages[messages.length - 1].content }
          ]
        }],
        generationConfig: { 
          temperature: 0.1,
          topP: 0.95 
        }
      }),
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});
