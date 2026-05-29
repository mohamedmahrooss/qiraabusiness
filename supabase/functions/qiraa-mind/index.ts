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

// 1. Market Ontology Layer (The VC to Database Bridge)
const MARKET_ONTOLOGY: Record<string, string[]> = {
  "fintech": ["fintech", "financial technology", "payments", "banking", "wealthtech", "insurtech", "regtech", "تقنية مالية", "التقنية المالية", "مدفوعات"],
  "enterprise software": ["enterprise software", "b2b saas", "vertical saas", "erp infra", "workflow tools", "saas", "hrtech", "martech", "govtech", "legal", "برمجيات الأعمال", "b2b"],
  "healthtech": ["health", "healthtech", "biotechnology", "digital health", "تقنية صحية", "الصحة الرقمية", "طبية"],
  "edtech": ["education", "edtech", "learning platform", "تقنية تعليم", "تعليم إلكتروني"],
  "transportation & logistics": ["transportation", "logistics", "mobilitytech", "supply chain", "نقل", "لوجستيات", "سلاسل الإمداد"],
  "retail & ecommerce": ["retail industry", "ecommerce", "e-commerce", "marketplace", "consumer electronics", "fashion", "تجارة إلكترونية", "تجزئة"],
  "proptech": ["real estate", "proptech", "home living", "تقنية عقارية", "عقارات"],
  "agritech & foodtech": ["food", "foodtech", "agritech", "تكنولوجيا الغذاء", "تكنولوجيا زراعية", "أغذية", "زراعة"],
  "ai & deeptech": ["ai", "artificial intelligence", "robotics", "semiconductors", "ذكاء اصطناعي", "تعلم الآلة", "deep tech"],
  "media & gaming": ["media", "entert. & gaming", "gaming", "music", "event tech", "إعلام", "ألعاب", "ترفيه"],
  "climate & energy": ["energy", "climatetech", "chemicals", "طاقة", "تكنولوجيا المناخ", "كيماويات"],
  "cybersecurity": ["security", "cybersecurity", "أمن سيبراني", "حماية"],
  "telecom & infrastructure": ["telecom", "comtech", "hosting", "اتصالات", "استضافة"],
  "spacetech": ["space", "spacetech", "فضاء"],
  "traveltech": ["travel", "traveltech", "سياحة", "سفر"],
  "wellness beauty": ["wellness beauty", "تجميل", "صحة وعناية"],
  "miscellaneous": ["dating", "jobs recruitment", "kids", "marketing", "sports", "engineering and manufacturing equipment", "ip tech"]
};

// 2. Sovereign Country Normalization
const COUNTRY_ALIASES: Record<string, string[]> = {
  "saudi arabia": ["saudi arabia", "ksa", "saudi", "السعودية", "المملكة", "المملكة العربية السعودية"],
  "egypt": ["egypt", "مصر", "جمهورية مصر العربية"],
  "uae": ["uae", "united arab emirates", "emirates", "الإمارات", "الامارات", "الامارات العربية المتحدة"],
  "jordan": ["jordan", "الأردن", "الاردن"],
  "morocco": ["morocco", "المغرب"],
  "kuwait": ["kuwait", "الكويت"]
};

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").trim();
}

function resolveOntology(inputs: string[], mapping: Record<string, string[]>): string[] {
  if (!inputs || inputs.length === 0) return [];
  const resolved = new Set<string>();
  for (const input of inputs) {
    const normalizedInput = normalizeText(input);
    let matched = false;
    for (const [canonical, aliases] of Object.entries(mapping)) {
      const isMatch = aliases.some((alias) => normalizedInput.includes(normalizeText(alias)));
      if (isMatch) {
        aliases.forEach((a) => resolved.add(a));
        resolved.add(canonical);
        matched = true;
      }
    }
    if (!matched) resolved.add(input);
  }
  return [...resolved];
}

// 3. Smart Fallback Extraction 
function extractCoreKeywords(message: string): string[] {
  const stopWords = ["اريد", "أريد", "ابدا", "أبدأ", "بناء", "على", "عن", "كيف", "ماذا", "هل", "شركة", "قطاع", "استثمار", "صندوق", "تمويل", "جولات", "في", "من", "الى", "إلى", "التي", "الذي", "بناءً", "أحدث", "هناك", "ماهي", "ما", "هي", "أفضل", "افضل"];
  return message.split(/\s+/)
    .map(w => normalizeText(w))
    .filter(w => {
      if (stopWords.includes(w)) return false;
      const isEnglish = /^[a-zA-Z]+$/.test(w);
      return isEnglish || w.length > 3; 
    });
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

    const ANTHROPIC_API_KEY = Deno.env.get("QIRAA_MIND_ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("QIRAA_MIND_ANTHROPIC_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const querySupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${userToken}` } },
    });
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

    let userId: string | null = null;
    let isAdmin = false;
    let userProfile: any = null;

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

    if (!isAdmin) {
      if (profile.has_qiraa_mind !== true) {
        return new Response(JSON.stringify({ error: "خاصية عقل قراءة غير مفعلة لحسابك. يرجى ترقية باقتك." }), { status: 403, headers: corsHeaders });
      }
      if (profile.qiraa_mind_tokens <= 0) {
        return new Response(JSON.stringify({ error: "نفد رصيد توكنز عقل قراءة. يرجى شحن رصيدك للمتابعة." }), { status: 403, headers: corsHeaders });
      }
    }

    const latestUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content || "";

    // 4. Intent Extraction using Claude-Opus-4-7
    const extractionPrompt = `أنت محرك استخراج استخبارات سوقية احترافي لمنصة قراءة.
قم بتحليل رسالة المستخدم واستخراج العناصر التالية بدقة شديدة كصيغة JSON فقط.

رسالة المستخدم: "${latestUserMessage}"

المخرج المطلوب:
{
  "sectors": ["قطاع 1"],
  "countries": ["دولة 1"],
  "companies": ["شركة 1"],
  "round_types": ["نوع 1"],
  "temporal_filters": ["فلتر زمني"],
  "strategic_intent": ["النية 1"]
}`;

    let extractedData: RetrievalIntent = { sectors: [], countries: [], companies: [], round_types: [], temporal_filters: [], strategic_intent: [] };

    try {
      const extractionResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-opus-4-7",
          max_tokens: 1000,
          system: "أنت تعمل كمستخرج بيانات JSON فقط. لا تقم بإرجاع أي نصوص، مقدمات، أو تنسيقات Markdown. أرجع كائن JSON نظيف.",
          messages: [{ role: "user", content: extractionPrompt }],
          temperature: 0,
        }),
      });

      if (extractionResponse.ok) {
        const aiJson = await extractionResponse.json();
        const rawContent = aiJson.content?.[0]?.text || "";
        const cleanJson = rawContent.replace(/\x60{3}json\n?|\x60{3}/gi, "").trim();
        extractedData = JSON.parse(cleanJson);
      } else {
        console.error("Extraction API Error:", await extractionResponse.text());
      }
    } catch (err) {
      console.warn("Extraction Parsing Failed:", err);
    }

    // 5. Ontology Application
    const resolvedSectors = resolveOntology(extractedData.sectors || [], MARKET_ONTOLOGY);
    const resolvedCountries = resolveOntology(extractedData.countries || [], COUNTRY_ALIASES);
    
    let coreSearchTerms = [...resolvedSectors, ...(extractedData.companies || [])];
    
    // Smart Fallback Activation
    if (coreSearchTerms.length === 0) {
        coreSearchTerms = extractCoreKeywords(latestUserMessage);
    }

        // 6. Database Query Execution
    let analyticsQuery = querySupabase.from("analytics").select("title_ar, content_ar, updated_at, country").order("updated_at", { ascending: false }).limit(15);
    let companiesQuery = querySupabase.from("qiraa_companies").select("name, description, sector_main, country, valuation_min_usd, valuation_max_usd, total_funding_usd, growth_stage, founded_year, employee_range, revenue_estimate, growth_rate").order("total_funding_usd", { ascending: false }).limit(15);
    let transactionsQuery = querySupabase.from("qiraa_transactions").select("company_name, sector_main, sectors_sub, round_type, round_amount_usd, growth_stage, valuation_min_usd, valuation_max_usd, total_funding_usd, investors, country, round_year, round_month, investor_type, transaction_type, lead_investor, valuation_currency").order("round_year", { ascending: false }).order("round_month", { ascending: false }).limit(20);

    const analyticsConditions = buildOrConditions(["content_ar", "title_ar"], coreSearchTerms);
    const companiesConditions = buildOrConditions(["sector_main", "name", "tags", "description"], coreSearchTerms);
    const transactionsConditions = buildOrConditions(["sector_main", "company_name", "investors"], coreSearchTerms);

    if (analyticsConditions) analyticsQuery = analyticsQuery.or(analyticsConditions);
    if (companiesConditions) companiesQuery = companiesQuery.or(companiesConditions);
    if (transactionsConditions) transactionsQuery = transactionsQuery.or(transactionsConditions);

    // Strict Geography Filtering
    if (resolvedCountries.length > 0) {
      const countryConditions = buildOrConditions(["country"], resolvedCountries);
      if (countryConditions) {
        analyticsQuery = analyticsQuery.or(countryConditions);
        companiesQuery = companiesQuery.or(countryConditions);
        transactionsQuery = transactionsQuery.or(countryConditions);
      }
    }

    const [analyticsRes, companiesRes, transactionsRes] = await Promise.all([analyticsQuery, companiesQuery, transactionsQuery]);

    console.log("\n=== 🔴 QIRAA MIND EXTRACTION DIAGNOSTICS ===");
    console.log(JSON.stringify({
      rawExtraction: extractedData,
      resolvedSectors: resolvedSectors,
      resolvedCountries: resolvedCountries,
      coreSearchTerms: coreSearchTerms,
      analyticsConditions,
      companiesConditions,
      transactionsConditions
    }, null, 2));

    console.log("\n=== 🟢 QIRAA MIND DB RESULTS ===");
    console.log(JSON.stringify({
      analyticsCount: analyticsRes.data?.length || 0,
      companiesCount: companiesRes.data?.length || 0,
      transactionsCount: transactionsRes.data?.length || 0
    }, null, 2));

    const compressedContext = compressContext(analyticsRes.data || [], companiesRes.data || [], transactionsRes.data || []);

    // 8. Sovereign Anti-Hallucination Prompt
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
5- هيكل الإجابة: قدم الإجابة مهيكلة (الملخص التنفيذي، التحركات الرئيسية، الاست الاستراتيجي).
6- لا تذكر أبداً للمستخدم أنك تعتمد على "بيانات مرفقة"، بل تصرف كأنك تمتلكها.`;

    // 9. Response Generation Call
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-7", 
        max_tokens: 2500, 
        system: systemPrompt,
        messages,
        stream: true,
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      throw new Error(`Anthropic API Error: ${err}`);
    }

    // 10. Secure Streaming & Token Deduction
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
      async flush() {
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
