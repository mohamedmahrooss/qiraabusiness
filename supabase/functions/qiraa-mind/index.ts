import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-auth-token",
};

type RetrievalIntent = {
  sectors: string[];
  countries: string[];
  companies: string[];
  round_types: string[];
  temporal_filters: string[];
  strategic_intent: string[];
};

// Canonical Sector Mapping Engine (لحل مشاكل تعدد اللغات والمرادفات)
const SECTOR_ALIASES: Record<string, string[]> = {
  fintech: ["fintech", "financial technology", "payments", "banking", "wallet", "digital banking", "payment gateway", "تقنية مالية", "التقنية المالية", "مدفوعات", "محفظة رقمية", "بنك رقمي", "تكنولوجيا مالية"],
  ecommerce: ["ecommerce", "e-commerce", "marketplace", "online retail", "تجارة إلكترونية", "متجر إلكتروني", "ماركت بليس"],
  healthtech: ["healthtech", "digital health", "telemedicine", "تقنية صحية", "الصحة الرقمية", "تكنولوجيا صحية"],
  edtech: ["edtech", "education technology", "learning platform", "تقنية تعليم", "تعليم إلكتروني"],
  agritech: ["agritech", "agriculture technology", "تقنية زراعية", "تكنولوجيا الزراعة"],
  proptech: ["proptech", "property technology", "real estate tech", "تقنية عقارية", "تكنولوجيا العقارات"],
};

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").trim();
}

function resolveSectorAliases(inputSectors: string[]): string[] {
  const resolved = new Set<string>();
  for (const sector of inputSectors) {
    const normalizedSector = normalizeText(sector);
    let matchedInCanonical = false;
    for (const [canonical, aliases] of Object.entries(SECTOR_ALIASES)) {
      const matched = aliases.some((alias) => normalizeText(alias) === normalizedSector);
      if (matched) {
        aliases.forEach((a) => resolved.add(a));
        resolved.add(canonical);
        matchedInCanonical = true;
      }
    }
    if (!matchedInCanonical) resolved.add(sector);
  }
  return [...resolved];
}

function buildOrConditions(fields: string[], values: string[]): string | null {
  if (!values || !values.length) return null;
  const conditions: string[] = [];
  for (const field of fields) {
    for (const value of values) {
      if (value.trim()) conditions.push(`${field}.ilike.%${value}%`);
    }
  }
  return conditions.length > 0 ? conditions.join(",") : null;
}

// Context Compression Layer (يجمع ويضغط البيانات بدون قص النصوص الأساسية للتحليلات)
function compressContext(analytics: any[], companies: any[], transactions: any[]) {
  const topFundingRounds = [...transactions]
    .sort((a, b) => (b.round_amount_usd || 0) - (a.round_amount_usd || 0))
    .slice(0, 5);

  const dominantCountries = [...new Set(companies.map((c) => c.country).filter(Boolean))].slice(0, 10);
  const dominantSectors = [...new Set(companies.map((c) => c.sector_main).filter(Boolean))].slice(0, 10);
  const emergingPatterns = analytics.map((a) => a.title_ar).filter(Boolean).slice(0, 10);

  return {
    strategic_summary: {
      total_market_signals: analytics.length,
      total_companies_detected: companies.length,
      total_transactions_detected: transactions.length,
    },
    dominant_countries: dominantCountries,
    dominant_sectors: dominantSectors,
    critical_transactions: topFundingRounds,
    emerging_patterns: emergingPatterns,
    // نحتفظ بالنص الكامل content_ar لأهم 10 تحليلات كحد أقصى لضمان عدم ضياع السياق
    raw_market_intelligence: analytics.slice(0, 10), 
    raw_companies: companies.slice(0, 10),
    raw_transactions: transactions.slice(0, 15),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const userToken = req.headers.get("x-auth-token");

    if (!userToken) {
      return new Response(JSON.stringify({ error: "طلب غير مصرح به. يرجى تسجيل الدخول." }), { status: 401, headers: corsHeaders });
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // 1. Dual-Client Architecture (فصل الصلاحيات الأمني)
    const querySupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${userToken}` } },
    });
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

    let userId: string | null = null;
    let isAdmin = false;
    let userProfile: any = null;

    // 2. Authentication & Secure Role Check
    const { data: { user }, error: authError } = await adminSupabase.auth.getUser(userToken);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "فشل التحقق من هوية المستخدم." }), { status: 401, headers: corsHeaders });
    }
    userId = user.id;

    const { data: roleData } = await adminSupabase.from("user_roles").select("role").eq("user_id", userId).single();
    if (roleData?.role === "admin") isAdmin = true;

    const { data: profile, error: profileError } = await adminSupabase.from("profiles").select("*").eq("user_id", userId).single();
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

    const latestUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content || "";

    // 4. Intelligence Extraction Engine
    const openRouterKeysStr = Deno.env.get("OPENROUTER_KEYS");
    if (!openRouterKeysStr) throw new Error("OPENROUTER_KEYS are not configured");
    const openRouterKeys = openRouterKeysStr.split(",");
    const activeOpenRouterKey = openRouterKeys[Math.floor(Math.random() * openRouterKeys.length)];

    const extractionPrompt = `أنت محرك استخراج استخبارات سوقية احترافي لمنصة قراءة.
قم بتحليل رسالة المستخدم واستخراج العناصر التالية بدقة شديدة.

قواعد صارمة:
1- أرجع JSON فقط.
2- ممنوع أي Markdown.
3- استنتج القطاع والدولة والنية الاستراتيجية حتى لو لم تذكر نصاً.
4- إذا لم توجد قيمة ملموسة، استخدم مصفوفة فارغة [].

رسالة المستخدم: "${latestUserMessage}"

المخرج المطلوب:
{
  "sectors": ["قطاع 1", "قطاع 2"],
  "countries": ["دولة 1"],
  "companies": ["شركة 1"],
  "round_types": ["نوع 1"],
  "temporal_filters": ["فلتر زمني"],
  "strategic_intent": ["النية 1"]
}`;

    let extractedData: RetrievalIntent = { sectors: [], countries: [], companies: [], round_types: [], temporal_filters: [], strategic_intent: [] };

    try {
      const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${activeOpenRouterKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [{ role: "user", content: extractionPrompt }],
          temperature: 0,
        }),
      });

      if (openRouterRes.ok) {
        const aiJson = await openRouterRes.json();
        const rawContent = aiJson.choices?.[0]?.message?.content || "";
        const cleanJson = rawContent.replace(/```json\n?|```/g, "").trim();
        extractedData = JSON.parse(cleanJson);
      }
    } catch (err) {
      console.warn("Extraction Engine Failed, using fallback. Error:", err);
    }

    // 5. Normalization & Dynamic Query Builders
    const resolvedSectors = resolveSectorAliases(extractedData.sectors || []);
    const coreSearchTerms = [...resolvedSectors, ...(extractedData.companies || [])];
    
    // Fallback: If AI failed completely to extract sectors or companies, use simple words from prompt
    if (coreSearchTerms.length === 0) {
        const fallbackWords = latestUserMessage.split(' ').slice(0, 3).filter((w: string) => w.length > 3);
        coreSearchTerms.push(...fallbackWords);
    }

    let analyticsQuery = querySupabase.from("analytics").select("title_ar, content_ar, updated_at, country").order("updated_at", { ascending: false }).limit(15);
    const analyticsConditions = buildOrConditions(["content_ar", "title_ar"], coreSearchTerms);
    if (analyticsConditions) analyticsQuery = analyticsQuery.or(analyticsConditions);

    let companiesQuery = querySupabase.from("qiraa_companies").select("name, description, sector_main, country, total_funding_usd, growth_stage, founded_year, employee_range, revenue_estimate, growth_rate").order("total_funding_usd", { ascending: false }).limit(15);
    const companiesConditions = buildOrConditions(["sector_main", "name", "tags", "description"], coreSearchTerms);
    if (companiesConditions) companiesQuery = companiesQuery.or(companiesConditions);

    let transactionsQuery = querySupabase.from("qiraa_transactions").select("company_name, round_type, round_amount_usd, investors, country, round_year, round_month, investor_type, transaction_type, lead_investor, valuation_currency").order("round_year", { ascending: false }).order("round_month", { ascending: false }).limit(20);
    const transactionsConditions = buildOrConditions(["sector_main", "company_name", "investors"], coreSearchTerms);
    if (transactionsConditions) transactionsQuery = transactionsQuery.or(transactionsConditions);

    // Apply strict Country and Round Filters if extracted
    const extractedCountries = extractedData.countries || [];
    if (extractedCountries.length > 0) {
      const countryConditions = buildOrConditions(["country"], extractedCountries);
      if (countryConditions) {
        analyticsQuery = analyticsQuery.or(countryConditions);
        companiesQuery = companiesQuery.or(countryConditions);
        transactionsQuery = transactionsQuery.or(countryConditions);
      }
    }

    const extractedRounds = extractedData.round_types || [];
    if (extractedRounds.length > 0) {
      const roundConditions = buildOrConditions(["round_type"], extractedRounds);
      if (roundConditions) transactionsQuery = transactionsQuery.or(roundConditions);
    }

    const [analyticsRes, companiesRes, transactionsRes] = await Promise.all([analyticsQuery, companiesQuery, transactionsQuery]);

    // 6. Context Compression
    const compressedContext = compressContext(analyticsRes.data || [], companiesRes.data || [], transactionsRes.data || []);

    // 7. Sovereign Anti-Hallucination Prompt
    const systemPrompt = `أنت "عقل قراءة" (QIRAA Mind).
أنت محرك ذكاء أسواق سيادي متخصص بأسواق الشرق الأوسط وشمال أفريقيا، مصمم لخدمة صناع القرار والـ VCs.

<market_intelligence>
${JSON.stringify(compressedContext)}
</market_intelligence>

قواعد سيادية صارمة لمنع الهلوسة (Anti-Hallucination):
1- حظر معرفي: يُمنع منعاً باتاً استخدام أي معلومات أو بيانات مدربة مسبقاً داخل نموذجك.
2- مصدر وحيد: استنتاجاتك يجب أن تكون مدعومة حصرياً ومنطقياً بالبيانات الموجودة داخل قسم <market_intelligence> فقط.
3- إعلان العجز: إذا كانت البيانات المرفقة لا تحتوي على إجابة شافية لسؤال المستخدم، قل حرفياً: "بناءً على التحديثات اللحظية في محرك قراءة، لا تتوافر معلومات دقيقة حول هذا القطاع حالياً، يرجى توسيع نطاق البحث."
4- لغة المال: استخدم لغة تنفيذية احترافية، حادة، خالية من الحشو والاعتذارات.
5- هيكل الإجابة: قدم الإجابة مهيكلة (الملخص التنفيذي، التحركات الرئيسية، الاستنتاج الاستراتيجي).
6- لا تذكر أبداً للمستخدم أنك تعتمد على "بيانات مرفقة"، بل تصرف كأنك تمتلكها.`;

    // 8. Direct Call to Anthropic API
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-7",
        max_tokens: 2500, // مساحة كافية للتحليلات العميقة
        system: systemPrompt,
        messages,
        stream: true,
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      throw new Error(`Anthropic API Error: ${err}`);
    }

    // 9. Streaming & Bulletproof Token Deduction
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
      async flush() {
        // الخصم يحدث هنا فقط: ضمان وصول البيانات بالكامل للعميل ونجاح المحادثة بنسبة 100%
        if (userId && !isAdmin && userProfile) {
          await adminSupabase
            .from("profiles")
            .update({ qiraa_mind_tokens: userProfile.qiraa_mind_tokens - 1 })
            .eq("user_id", userId);
        }
      }
    });

    return new Response(anthropicResponse.body!.pipeThrough(transformStream), {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error: any) {
    console.error("Qiraa Mind Sovereign Error:", error);
    return new Response(JSON.stringify({ error: error.message || "حدث خطأ داخلي في محرك قراءة." }), { status: 500, headers: corsHeaders });
  }
});
