import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const HF_TOKEN = Deno.env.get("HF_TOKEN")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const sourceMonth = formData.get("source_month") as string;
    const sourceYear = formData.get("source_year") as string;

    if (!file) throw new Error("No file uploaded");

    // 1. رفع الملف إلى Storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `documents/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("qiraa-knowledge-base")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. الحصول على الرابط العام
    const { data: { publicUrl } } = supabase.storage
      .from("qiraa-knowledge-base")
      .getPublicUrl(filePath);

    // 3. قراءة الملف لاستخراجه باستخدام Qwen-VL
    let extractedContent = "";
    
    try {
      const hfResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-VL-72B-Instruct:hyperbolic",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "استخرج كل النصوص والجداول من هذا المستند بدقة متناهية. حول الجداول إلى صيغة Markdown. لا تضف أي تعليقات من عندك، فقط البيانات الموجودة."
                },
                {
                  type: "image_url",
                  image_url: { url: publicUrl }
                }
              ]
            }
          ],
          stream: false
        })
      });

      if (hfResponse.ok) {
        const hfData = await hfResponse.json();
        extractedContent = hfData.choices[0]?.message?.content || "لم يتم استخراج محتوى.";
      } else {
        const errText = await hfResponse.text();
        console.error("HF Vision API Error:", errText);
        extractedContent = `[تم الرفع بنجاح - تعذر الاستخراج التلقائي. الخطأ: ${errText}]`;
      }
    } catch (visionError) {
      console.error("Vision Model Catch:", visionError);
      extractedContent = "[فشل الاتصال بنموذج الرؤية أثناء الاستخراج]";
    }

    // 4. حفظ البيانات مع المحتوى المستخرج في قاعدة البيانات
    const { data: doc, error: insertError } = await supabase
      .from("qiraa_mind_documents")
      .insert({
        title,
        file_url: publicUrl,
        file_path: filePath,
        source_month: sourceMonth,
        source_year: sourceYear ? parseInt(sourceYear) : null,
        content: extractedContent,
        is_active: true
      })
      .select().single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true, document: doc }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 400, headers: corsHeaders,
    });
  }
});
