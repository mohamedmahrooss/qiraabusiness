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
    
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    // استخدام Service Key يمنحنا صلاحية تخطي RLS للقيام بالعمليات الإدارية بأمان
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Authentication, Feature Gate & Role Check
    let userId: string | null = null;
    let isAdmin = false;
    let userProfile = null;

    if (!userToken) {
        return new Response(JSON.stringify({ error: "طلب غير مصرح به. يرجى تسجيل الدخول." }), { status: 401, headers: corsHeaders });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(userToken);
    if (authError || !user) {
        return new Response(JSON.stringify({ error: "فشل التحقق من هوية المستخدم." }), { status: 401, headers: corsHeaders });
    }

    userId = user.id;

    // أ- التحقق من صلاحيات المسؤول (Admin Check) من جدول user_role بدقة
    const { data: roleData } = await supabase.from('user_role').select('role').eq('user_id', userId).single();
    if (roleData && roleData.role === 'admin') {
        isAdmin = true;
    }

    // ب- جلب بيانات العميل والتحقق من الصلاحيات
    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    if (profileError || !profile) {
        return new Response(JSON.stringify({ error: "لم يتم العثور على ملف تعريف المستخدم." }), { status: 404, headers: corsHeaders });
    }
    
    userProfile = profile;

    // ج- تطبيق بوابات الدفع والصلاحيات (لغير المديرين فقط)
    if (!isAdmin) {
        if (profile.has_qiraa_mind !== true) {
            return new Response(JSON.stringify({ error: "خاصية عقل قراءة غير مفعلة لحسابك. يرجى ترقية باقتك." }), { status: 403, headers: corsHeaders });
        }
        if (profile.qiraa_mind_tokens <= 0) {
            return new Response(JSON.stringify({ error: "نفد رصيد توكنز عقل قراءة. يرجى شحن رصيدك للمتابعة." }), { status: 403, headers: corsHeaders });
        }
    }

    // 2. The AI Pre-processor (OpenRouter 4D Extraction Engine)
    const latestUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || "";
    
    const openRouterKeysStr = Deno.env.get("OPENROUTER_KEYS");
    if (!openRouterKeysStr) throw new Error("OPENROUTER_KEYS are not configured");
    const openRouterKeys = openRouterKeysStr.split(',');
    const activeOpenRouterKey = openRouterKeys[Math.floor(Math.random() * openRouterKeys.length)];

    const extractionPrompt = `أنت أداة استخبارات بيانات دقيقة. حلل رسالة المستخدم واستخرج أو استنتج المحددات التالية لبناء استعلام دقيق لقاعدة البيانات.

قواعد صارمة جداً:
1. أرجع النتيجة بصيغة JSON فقط.
2. لا تضف أي نص تمهيدي، ولا تضف علامات Markdown مثل \`\`\`json.
3. استنتج القطاع والدولة حتى لو لم تُذكر صراحة (مثال: "تطبيق مدفوعات" يعني القطاع "FinTech").
4. إذا لم تجد أو تستنتج القيمة، ضع "null".

رسالة المستخدم: "${latestUserMessage}"

المخرج المطلوب بالضبط:
{"sector": "اسم القطاع أو null", "country": "اسم الدولة أو null", "company": "اسم الشركة المستهدفة أو null", "round_type": "نوع الجولة مثل Seed, Series A, Acquisition أو null"}`;

    let extractedData = { sector: "", country: "", company: "", round_type: "" };
    
    try {
      const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${activeOpenRouterKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [{ role: "user", content: extractionPrompt }]
        })
      });

      if (openRouterRes.ok) {
        const aiJson = await openRouterRes.json();
        const rawContent = aiJson.choices[0].message.content;
        const cleanJson = rawContent.replace(/```json\n?|```/g, '').trim();
        extractedData = JSON.parse(cleanJson);
      }
    } catch (extractionError) {
      console.warn("OpenRouter Extraction fallback triggered:", extractionError);
    }

    const sectorTerm = (extractedData.sector && extractedData.sector !== "null") ? extractedData.sector : null;
    const countryTerm = (extractedData.country && extractedData.country !== "null") ? extractedData.country : null;
    const companyTerm = (extractedData.company && extractedData.company !== "null") ? extractedData.company : null;
    const roundTerm = (extractedData.round_type && extractedData.round_type !== "null") ? extractedData.round_type : null;
    
    const fallbackTerm = latestUserMessage.split(' ').slice(0, 3).join(' ');
    const primarySearchTerm = companyTerm || sectorTerm || fallbackTerm;

    // 3. Precision Database Querying (T+0 Live Data Engine - 4D Dynamic Builders)
    let analyticsQuery = supabase.from('analytics')
        .select('title_ar, content_ar, updated_at, country')
        .order('updated_at', { ascending: false })
        .limit(10);
        
    if (companyTerm) {
        analyticsQuery = analyticsQuery.ilike('content_ar', `%${primarySearchTerm}%`);
    } else {
        analyticsQuery = analyticsQuery.or(`content_ar.ilike.%${primarySearchTerm}%,title_ar.ilike.%${primarySearchTerm}%`);
    }

    let companiesQuery = supabase.from('qiraa_companies')
        .select('name, description, sector_main, country, total_funding_usd, growth_stage')
        .order('total_funding_usd', { ascending: false })
        .limit(10);
        
    if (companyTerm) {
        companiesQuery = companiesQuery.ilike('name', `%${primarySearchTerm}%`);
    } else {
        companiesQuery = companiesQuery.or(`sector_main.ilike.%${primarySearchTerm}%,name.ilike.%${primarySearchTerm}%,tags.ilike.%${primarySearchTerm}%`);
    }

    let transactionsQuery = supabase.from('qiraa_transactions')
        .select('company_name, round_type, round_amount_usd, investors, country, round_year, round_month')
        .order('round_year', { ascending: false })
        .order('round_month', { ascending: false })
        .limit(15);
        
    if (companyTerm) {
        transactionsQuery = transactionsQuery.ilike('company_name', `%${primarySearchTerm}%`);
    } else {
        transactionsQuery = transactionsQuery.or(`sector_main.ilike.%${primarySearchTerm}%,company_name.ilike.%${primarySearchTerm}%`);
    }

    if (countryTerm) {
        analyticsQuery = analyticsQuery.ilike('country', `%${countryTerm}%`);
        companiesQuery = companiesQuery.ilike('country', `%${countryTerm}%`);
        transactionsQuery = transactionsQuery.ilike('country', `%${countryTerm}%`);
    }
    
    if (roundTerm) {
        transactionsQuery = transactionsQuery.ilike('round_type', `%${roundTerm}%`);
    }

    const [analyticsRes, companiesRes, transactionsRes] = await Promise.all([
      analyticsQuery,
      companiesQuery,
      transactionsQuery
    ]);

    // الإبقاء على المحتوى كاملاً وعدم قص النصوص للاستفادة القصوى من سياق Opus
    const contextData = {
      market_intelligence: analyticsRes.data || [],
      top_companies: companiesRes.data || [],
      latest_transactions: transactionsRes.data || []
    };

    // 4. The Sovereign Prompt for Claude Opus 4.7
    const systemPrompt = `أنت 'عقل قراءة'، المحلل الاستراتيجي والمالي الحصري لمنصة QIRAA. 
معرفتك لحظية (T+0) وتستمدها مباشرة من محرك ذكاء قراءة.

<market_intelligence>
${JSON.stringify(contextData)}
</market_intelligence>

القواعد الصارمة:
1. أجب بناءً على بيانات <market_intelligence> فقط. اربط بين التحليلات والصفقات لتكوين استنتاج سيادي حاد.
2. إذا كان استعلام العميل خارج نطاق البيانات المرفقة، قل نصاً: "بناءً على بيانات محرك قراءة الحالية، لا تتوافر معلومات دقيقة حول هذا القطاع، يرجى توسيع نطاق البحث."
3. استخدم لغة مالية قاطعة، خالية من الحشو، وموجهة لصناديق رأس المال الجريء (VCs) و رؤساء الشركات و المستثمرين.
4. حظر مطلق: لا تستخدم عبارات مثل "بناءً على البيانات المرفقة" أو "كما يظهر في السياق". تحدث بثقة مطلقة وكأنك تمتلك المعلومة.
5. الإيجاز: قدم إجابتك في هيكل مباشر (ملخص، أرقام حاسمة، استنتاج) بدون مقدمات ترحيبية.`;

    // 5. Direct Call to Anthropic API (Claude Opus 4.7)
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-7", // تم التحديث للنموذج الأقوى والحالي
        max_tokens: 2000, // زيادة التوكنز قليلاً لاستيعاب السياق الأضخم
        system: systemPrompt,
        messages: messages,
        stream: true,
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.json();
      throw new Error(`Anthropic API Error: ${JSON.stringify(err)}`);
    }

    // 6. Safe Token Deduction (درع التوكن اللحظي)
    // نستخدم TransformStream لمراقبة الـ Stream. لا يتم الخصم إلا عند الانتهاء بنجاح.
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
      async flush() {
        // يتم تنفيذ هذا الكود فقط إذا انتهى إرسال الرد بنجاح (بدون انقطاع)
        if (userId && !isAdmin && userProfile) {
            await supabase.from('profiles').update({ qiraa_mind_tokens: userProfile.qiraa_mind_tokens - 1 }).eq('user_id', userId);
        }
      }
    });

    // 7. Stream the Response to the UI through the Transformer
    return new Response(anthropicResponse.body!.pipeThrough(transformStream), {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
      },
    });

  } catch (error: any) {
    console.error("Qiraa Mind Error:", error);
    return new Response(JSON.stringify({ error: error.message || "حدث خطأ داخلي في محرك قراءة." }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});