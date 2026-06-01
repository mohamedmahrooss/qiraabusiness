import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-auth-token",
};

type RetrievalIntent = {
  sectors: string[];
  analytics_category: string | null;
  countries: string[];
  companies: string[];
  round_types: string[];
  temporal_filters: string[];
  strategic_intent: string[];
};

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

const ANALYTICS_CATEGORIES: Record<string, string> = {
  "Retail Industry": "07d27d24-4eaa-49c7-88c1-5b512e4a61fa",
  "PropTech": "6a66f87f-f8f5-48be-9ba4-d05fdbdc1635",
  "Logistics": "0abece92-8243-4e8d-9aef-909dc7259aaf",
  "AI": "6c6b2ea8-a73d-4ffd-b4f4-501ab7af49a9",
  "AgriTech": "71918f55-cdd8-4e22-adac-89e4bebec992",
  "MobilityTech": "5894b58d-159a-4cc4-a8c7-58ceb9a33441",
  "ClimateTech": "5516d8a4-3835-485d-801c-fa1835e98d9b",
  "Cybersecurity": "3cc21b75-f24c-4e86-8ee9-75d1f4c18f9b",
  "entert. & Gaming": "20ffdaba-db7f-4049-9218-82dc8b9478db",
  "HealthTech": "05c17be0-a5af-42ac-866b-a69ae928b125",
  "GovTech": "3f61374d-a591-4c41-a3c1-9b235374f381",
  "HRTech": "766c56df-4be4-4461-bfe3-a09891ce2397",
  "MarTech": "8d17294e-bca6-4442-b87a-96f75cec8c84",
  "EdTech": "96c81072-dfa9-4ef6-acc4-9ca72ebd5f11",
  "FoodTech": "908e0f03-05e3-43db-9952-57fef8d90d16",
  "Biotechnology": "6d2d2136-be74-4e9d-97c1-fc53c79bed2c",
  "ComTech": "6bb71d63-3510-4622-b1dc-5a994d0790b3",
  "SpaceTech": "e42cc2f2-9c99-45ea-b87b-cd6cf0e06304",
  "IP Tech": "6388e598-30db-44e1-9a4e-877e4555046b",
  "TravelTech": "bb5fee41-8f44-46d1-bfc5-992d2c0fd402",
  "Fintech": "f66d73cd-ccee-4596-8bab-67950621ae66"
};

// تم التخلص تماماً من مصفوفة COUNTRY_ALIASES ودالة getCanonicalCountries

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
      if (aliases.some((alias) => normalizedInput.includes(normalizeText(alias)))) {
        aliases.forEach((a) => resolved.add(a));
        resolved.add(canonical);
        matched = true;
      }
    }
    if (!matched) resolved.add(input);
  }
  return [...resolved];
}

function extractCoreKeywords(message: string): string[] {
  const stopWords = ["اريد", "أريد", "ابدا", "أبدأ", "بناء", "على", "عن", "كيف", "ماذا", "هل", "شركة", "قطاع", "استثمار", "صندوق", "تمويل", "جولات", "في", "من", "الى", "إلى", "التي", "الذي", "بناءً", "أحدث", "هناك", "ماهي", "ما", "هي", "أفضل", "افضل"];
  return message.split(/\s+/)
    .map(w => normalizeText(w))
    .filter(w => {
      if (stopWords.includes(w)) return false;
      const isEnglish = /^[a-zA-Z]+$/.test(w);
      return isEnglish || w.length >= 3; 
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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, is_deep_dive } = await req.json();
    const userToken = req.headers.get("x-auth-token");

    if (!userToken) {
      return new Response(JSON.stringify({ error: "طلب غير مصرح به. يرجى تسجيل الدخول." }), { status: 401, headers: corsHeaders });
    }

    const ANTHROPIC_API_KEY = Deno.env.get("QIRAA_MIND_ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("QIRAA_MIND_ANTHROPIC_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("QIRAA_ADMIN_KEY")!;
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

    // 📍 نقطة التفتيش الأولى: استلام سؤال المستخدم
    console.log(JSON.stringify({
      trace_id: "CHECKPOINT_1_RAW_USER_QUERY",
      timestamp: new Date().toISOString(),
      user_query: latestUserMessage,
      is_deep_dive_active: !!is_deep_dive
    }));

    const categoriesList = Object.keys(ANALYTICS_CATEGORIES).join(", ");

    // التعديل الجوهري: توجيه الذكاء الاصطناعي لتوحيد أسماء الدول تلقائياً
    const extractionPrompt = `أنت محرك استنتاج دلالي (Semantic Inference Engine) لمنصة ذكاء أسواق سيادية.
مهمتك هي قراءة سياق المحادثة بدقة، واستنتاج الأبعاد الاستثمارية، القطاعات الجغرافية، والشركات المقصودة كصيغة JSON فقط.
أنت تعمل كمحرك استنتاج وإرجاع بيانات JSON فقط. لا تقم بإرجاع أي نصوص، مقدمات، أو تنسيقات Markdown. أرجع كائن JSON نظيف يمثل استنتاجك العميق.

[تعليمات هامة جداً لأسماء الدول]:
عند استخراج أسماء الدول، قم دائماً بترجمتها وتوحيدها إلى الاسم الإنجليزي القياسي (مثل: Egypt, Saudi Arabia, UAE) مهما كانت اللغة أو الصيغة أو الاختصار الذي كتب به المستخدم (مثل: مصر، المملكة، KSA).

قواعد الاستنتاج لـ "analytics_category":
بناءً على الفهم الدلالي، اختر القطاع الرئيسي "الأقرب" معمارياً من هذه القائمة:
[${categoriesList}]

أخرج JSON فقط بالهيكل التالي:
{
  "analytics_category": "القطاع الأقرب من القائمة المرفقة أعلاه أو null",
  "sectors": ["قائمة بكافة القطاعات الفرعية أو الرئيسية المستنتجة من السؤال"],
  "countries": ["قائمة بكافة الدول والأسواق المذكورة أو المستنتجة بعد التوحيد للإنجليزية"],
  "companies": ["قائمة بأسماء الشركات"],
  "round_types": ["أنواع جولات التمويل المذكورة"],
  "temporal_filters": ["النطاقات الزمنية المذكورة"],
  "strategic_intent": ["النية الاستراتيجية أو الهدف من السؤال"]
}`;

    let extractedData: RetrievalIntent = { analytics_category: null, sectors: [], countries: [], companies: [], round_types: [], temporal_filters: [], strategic_intent: [] };

    try {
      const extractionResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", 
          max_tokens: 1000,
          system: extractionPrompt, 
          messages: messages,       
          temperature: 0            
        }),
      });

      if (extractionResponse.ok) {
        const aiJson = await extractionResponse.json();
        const rawContent = aiJson.content?.[0]?.text || "";
        const cleanJson = rawContent.replace(/\x60{3}json\n?|\x60{3}/gi, "").trim();
        extractedData = JSON.parse(cleanJson);
      } else {
        const errorBody = await extractionResponse.text();
        console.error("🚨 Anthropic API Rejected Extraction:", errorBody);
      }
    } catch (err) {
      console.error("🚨 Network/Parsing Error during Extraction:", err);
    }

    // 📍 نقطة التفتيش الثانية: مخرجات الاستنتاج الدلالي
    console.log(JSON.stringify({
      trace_id: "CHECKPOINT_2_EXTRACTED_INTENT",
      timestamp: new Date().toISOString(),
      extracted_intent: extractedData
    }));

    const resolvedSectors = resolveOntology(extractedData.sectors || [], MARKET_ONTOLOGY);
    let coreSearchTerms = [...resolvedSectors, ...(extractedData.companies || [])];
    if (coreSearchTerms.length === 0) {
        coreSearchTerms = extractCoreKeywords(latestUserMessage);
    }

    const englishTerms = coreSearchTerms.filter(w => /[a-zA-Z]/.test(w));
    const arabicTerms = coreSearchTerms.filter(w => !/[a-zA-Z]/.test(w));

    // الاعتماد المباشر على مخرجات الذكاء الاصطناعي كقيمة معيارية
    const targetCountries = (extractedData.countries && extractedData.countries.length > 0) ? extractedData.countries : ["global"];
    const numCountries = targetCountries.length;
    
    const MAX_ANALYTICS = is_deep_dive ? 20 : 10;
    const MAX_COMPANIES = is_deep_dive ? 25 : 10;
    const MAX_TRANSACTIONS = is_deep_dive ? 20 : 15;

    const analyticsPerCountry = Math.ceil(MAX_ANALYTICS / numCountries);
    const companiesPerCountry = Math.ceil(MAX_COMPANIES / numCountries);
    const transactionsPerCountry = Math.ceil(MAX_TRANSACTIONS / numCountries);

    let allAnalytics: any[] = [];
    let allCompanies: any[] = [];
    let allTransactions: any[] = [];

    const analyticsCategoryId = extractedData.analytics_category ? ANALYTICS_CATEGORIES[extractedData.analytics_category] : null;

    const queryPromises = targetCountries.map(async (countryKey) => {
      
      const compCondsArr: string[] = [];
      const cEng = buildOrConditions(["sector_main", "name", "tags"], englishTerms);
      if (cEng) compCondsArr.push(cEng);
      const cAr = buildOrConditions(["tags"], arabicTerms);
      if (cAr) compCondsArr.push(cAr);
      const companiesConditions = compCondsArr.length > 0 ? compCondsArr.join(",") : null;

      const transCondsArr: string[] = [];
      const tEng = buildOrConditions(["sector_main", "company_name", "investors"], englishTerms);
      if (tEng) transCondsArr.push(tEng);
      const tAr = buildOrConditions(["investors"], arabicTerms);
      if (tAr) transCondsArr.push(tAr);
      const transactionsConditions = transCondsArr.length > 0 ? transCondsArr.join(",") : null;

      // بناء استعلام سريع ومباشر على الدولة المعيارية
      let aQuery = adminSupabase.from("analytics").select("title_ar, content_ar, updated_at, country, categories(name_en)").order("updated_at", { ascending: false }).limit(analyticsPerCountry);
      if (countryKey !== "global") aQuery = aQuery.ilike("country", `%${countryKey}%`);
      
      if (analyticsCategoryId) {
        aQuery = aQuery.eq("category_id", analyticsCategoryId);
      } else {
        const analyticsConditions = buildOrConditions(["content_ar", "title_ar"], coreSearchTerms);
        if (analyticsConditions) aQuery = aQuery.or(analyticsConditions);
      }

      let cQuery = adminSupabase.from("qiraa_companies").select("name, description, sector_main, country, valuation_min_usd, valuation_max_usd, total_funding_usd, growth_stage, founded_year, employee_range, revenue_estimate, growth_rate").order("total_funding_usd", { ascending: false }).limit(companiesPerCountry);
      if (countryKey !== "global") cQuery = cQuery.ilike("country", `%${countryKey}%`);
      if (companiesConditions) cQuery = cQuery.or(companiesConditions);

      let tQuery = adminSupabase.from("qiraa_transactions").select("company_name, sector_main, sectors_sub, round_type, round_amount_usd, growth_stage, valuation_min_usd, valuation_max_usd, total_funding_usd, investors, country, round_year, round_month, investor_type, transaction_type, lead_investor, valuation_currency").order("round_year", { ascending: false }).order("round_month", { ascending: false }).limit(transactionsPerCountry);
      if (countryKey !== "global") tQuery = tQuery.ilike("country", `%${countryKey}%`);
      if (transactionsConditions) tQuery = tQuery.or(transactionsConditions);

      const [aRes, cRes, tRes] = await Promise.all([aQuery, cQuery, tQuery]);
      
      return {
        analytics: aRes.data || [],
        companies: cRes.data || [],
        transactions: tRes.data || []
      };
    });

    const resultsArray = await Promise.all(queryPromises);

    resultsArray.forEach(res => {
      allAnalytics.push(...res.analytics);
      allCompanies.push(...res.companies);
      allTransactions.push(...res.transactions);
    });

    // 📍 نقطة التفتيش الثالثة: حصيلة البحث في قاعدة البيانات
    console.log(JSON.stringify({
      trace_id: "CHECKPOINT_3_DB_RESULTS",
      timestamp: new Date().toISOString(),
      retrieved_counts: {
        analytics: allAnalytics.length,
        companies: allCompanies.length,
        transactions: allTransactions.length
      }
    }));

    console.log("\n=== 🔴 QIRAA MIND EXTRACTION DIAGNOSTICS ===");
    console.log(JSON.stringify({
      targetCountriesKeys: targetCountries,
      limitsPerCountry: { analytics: analyticsPerCountry, companies: companiesPerCountry, transactions: transactionsPerCountry }
    }, null, 2));

    const rawContext = {
      raw_market_intelligence: allAnalytics.slice(0, MAX_ANALYTICS), 
      raw_companies: allCompanies.slice(0, MAX_COMPANIES),
      raw_transactions: allTransactions.slice(0, MAX_TRANSACTIONS),
    };

    const systemPrompt = `أنت "عقل قراءة" (QIRAA Mind).
أنت لست مساعداً آلياً؛ أنت "كبير المستشارين الاستراتيجيين" و محرك ذكاء أسواق سيادي متخصص بأسواق الشرق الأوسط و شمال افريقيا.
عملاؤك هم (General Partners) في صناديق الاستثمار الجريء (VCs)، و الرؤساء التنفيذيين و رواد الاعمال وصناع القرار الحكوميين. لغتك يجب أن تكون حادة، تنفيذية، شديدة الثقة، وخالية من أي تردد.
<market_intelligence>
${JSON.stringify(rawContext)}
</market_intelligence>
قواعد سيادية صارمة لتوليد الـ (Alpha) ومكافحة الهلوسة:
1- حظر معرفي: استنتاجاتك يجب أن تُبنى حصرياً و منطقياً على قسم <market_intelligence>. لا تكتب صفقات أو أرقام من خارج البيانات المرفقة.
2- لغة المال والسردية الاستراتيجية: اكتب بصيغة استثمارية قاطعة. لا تقل "يبدو أن"، قل "تُظهر حركة رأس المال أن". استخدم عبارات قابلة للاقتباس (Quotable Thesis) وقوية التأثير مثل: "نظام التشغيل لشركات الخليج"، "المراجحة الهيكلية (Structural Arbitrage)"، "هجرة القيمة".
3- حظر الإيموجي (STRICT NO EMOJIS): يُمنع منعاً باتاً استخدام أي إيموجي.
4- استخدم التنقيط (Bullets) مثل (-) أو (*) فقط.
5- حظر الجمل الدفاعية: يُمنع نهائياً استخدام أي عبارات إخلاء مسؤولية مثل "هذه ليست نصيحة استثمارية" أو "الاستنتاجات تقديرية". أنت محرك سيادي يبيع الثقة، تحدث كجهة إصدار تشريعي.
6- إجبارية الجداول (Data Tables): إذا طلب المستخدم مقارنة بين دولتين أو قطاعين، **يجب** أن ترسم جدولاً باحترافية عالية. استخدم التنسيق القياسي الصارم لجداول Markdown (Strict GFM Tables) مع استخدام الأعمدة الفاصلة (|) والصفوف التنسيقية (|---|---|---|).
7- معالجة الفراغ بذكاء (Data Vacuum): إذا لم تجد بيانات كافية عن قطاع معين في البيانات المرفقة، لا تعتذر ولا تقل "لا تتوافر معلومات". بل صُغها كـ "فراغ استثماري استراتيجي" (Strategic Vacuum) أو "نقص اختراق" (Underpenetration)، وضع توصية حول كيفية استغلال هذا الفراغ استثمارياً.
8- هيكل الإجابة التنفيذي:
   - جملة واحدة قاتلة وقابلة للاقتباس تلخص الفرصة.
   - تحليلك و تشريحك (عبر نقاط حادة وجدول مقارنة مبني بطريقة Markdown صارم).
   - مناورة الدخول (Entry Arbitrage): كيف يستغل المستخدم هذه المعطيات اليوم (خطوات عملية، هيكلة، استحواذ).
   - استراتيجية الخروج( Exit Scinario)
9- [تعليمات هندسة المخرجات - حرج جداً]:
  - الكثافة المعرفية (Cognitive Density): حافظ على أقصى درجات الكثافة بدون تجاوز 3000 حرف. هذا التحليل موجه لنخبة صناع القرار الذين يدفعون المال مقابل العمق.
  - منع البتر الاستراتيجي (Anti-Truncation Directive): يجب عليك هندسة طول الرد بذكاء حاد لضمان أن تكتمل رسالتك التحليلية واستنتاجاتك بشكل قاطع ومغلق تماماً في حدود 3000 حرف. يُحظر عليك بتر أي فكرة و إذا اقترب حد الحروف من الانتهاء قم بإغلق التحليل بخلاصة استراتيجية مركزة بإسم مختلف في كل مرة.`;

    // 📍 نقطة التفتيش الرابعة: الحمولة النهائية للنموذج (Payload)
    console.log(JSON.stringify({
      trace_id: "CHECKPOINT_4_FINAL_PAYLOAD",
      timestamp: new Date().toISOString(),
      model_target: "claude-opus-4-7",
      max_tokens_configured: is_deep_dive ? 4096 : 2000,
      context_length_chars: systemPrompt.length
    }));

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-7", 
        max_tokens: is_deep_dive ? 4096 : 2000,
        system: systemPrompt,
        messages,
        stream: true,
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      throw new Error(`Anthropic API Error: ${err}`);
    }

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
