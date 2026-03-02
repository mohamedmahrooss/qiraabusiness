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
    const HF_TOKEN = Deno.env.get("HF_TOKEN")!;
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // 1. استرجاع أحدث وأهم البيانات المستخرجة (RAG Context)
    const { data: docs } = await supabase
      .from("qiraa_mind_documents")
      .select("title, content")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(5);

    let contextData = "البيانات المرجعية (Knowledge Base):\n\n";
    if (docs && docs.length > 0) {
      docs.forEach((doc, index) => {
        contextData += `--- ملف: ${doc.title} ---\n${doc.content}\n\n`;
      });
    } else {
      contextData += "لا توجد بيانات متاحة حالياً.\n";
    }

    // 2. صياغة برومبت النظام الاستراتيجي (The Brain)
    const systemPrompt = `أنت "Qiraa Mind"، مستشار ذكاء سوقي استراتيجي ومهندس تحليلات خبير للشركات الناشئة في الشرق الأوسط (MENA).
مهمتك:
1. الإجابة بدقة متناهية بناءً على البيانات المرجعية المرفقة فقط.
2. الاستنتاج الاستراتيجي (Strategic Deduction): لا تكتفِ بالبحث النصي. إذا سأل المستخدم عن "فرص توظيف"، ابحث عن الشركات التي حصلت على "تمويل" أو أعلنت عن "توسع"، واستنتج أن هذه الشركات تحتاج لتوظيف، واذكر ذلك صراحة للمستخدم كتوصية قوية.
3. التحدث بلغة أعمال (Business Arabic) رصينة وحازمة ومباشرة.
4. اذكر الأرقام والنسب والإحصائيات بدقة تامة كما وردت.
5. لا تهلوس (Zero Hallucination). إذا لم تكن المعلومة موجودة أو لا يمكن استنتاجها منطقياً من البيانات، قل "لا توجد بيانات كافية في التقرير الحالي".

${contextData}`;

    // 3. ترتيب الرسائل للنموذج
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    // 4. استدعاء نموذج Qwen2.5-72B-Instruct عبر HuggingFace
    const hfResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-72B-Instruct:novita",
        messages: formattedMessages,
        stream: true,
        temperature: 0.2,
        top_p: 0.9,
      }),
    });

    if (!hfResponse.ok) {
      const errorData = await hfResponse.text();
      throw new Error(`HF API Error: ${errorData}`);
    }

    // 5. إرجاع الـ Stream مباشرة للواجهة الأمامية
    return new Response(hfResponse.body, { 
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" } 
    });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, headers: corsHeaders 
    });
  }
});
