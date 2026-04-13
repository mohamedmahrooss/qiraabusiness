import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-forwarded-for",
};

const FAWATERAK_SUPPORTED_CURRENCIES = new Set([
  "USD", "EGP", "SAR", "AED", "KWD", "QAR", "BHD"
]);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // ============================================================
    // 1. جلب المفاتيح من Supabase Secrets
    // ============================================================
    const FAWATERAK_API_KEY         = Deno.env.get("FAWATERAK_API_KEY");
    const SUPABASE_URL              = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const FIXER_API_KEY             = Deno.env.get("FIXER_API_KEY");
    const IPAPI_API_KEY             = Deno.env.get("IPAPI_API_KEY");

    if (!FAWATERAK_API_KEY || !FIXER_API_KEY || !IPAPI_API_KEY) {
      throw new Error("Critical System Error: Missing API Keys in Environment Variables.");
    }

    // ============================================================
    // 2. التحقق من هوية المستخدم
    // ============================================================
    const authHeader = req.headers.get("Authorization");
    const supabase   = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token      = authHeader?.replace("Bearer ", "");

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized access detected." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================================
    // 3. استقبال البيانات من الواجهة
    // ============================================================
    const { planId, isAnnual, paymentMethodId, userPhone } = await req.json();

    // ============================================================
    // 4. جلب بيانات المستخدم من مصدرين بالتوازي
    //
    // public.profiles  → subscription_plan, full_name
    // auth.users       → phone
    //
    // Promise.all يشغّلهما معاً لتوفير الوقت بدل الانتظار
    // ============================================================
    const [profileResult, authUserResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('subscription_plan, full_name')
        .eq('user_id', user.id)
        .single(),

      supabase.auth.admin.getUserById(user.id)
    ]);

    const userProfile = profileResult.data;
    const currentPlan = userProfile?.subscription_plan || 'free';
    const authPhone   = authUserResult.data?.user?.phone || null;

    // ============================================================
    // 5. تحديد رقم الهاتف النهائي
    //
    // 1) auth.users.phone  ← المصدر الرسمي (أدخله عند التسجيل)
    // 2) userPhone من الواجهة ← إذا لم يكن في auth
    // 3) لا يوجد → رفض بـ 400
    // ============================================================
    const finalPhone = authPhone || userPhone || null;

    if (!finalPhone) {
      return new Response(
        JSON.stringify({
          error: "Phone number is required.",
          error_code: "PHONE_REQUIRED",
          message: "يرجى إضافة رقم هاتفك في إعدادات الحساب أو إدخاله في نموذج الدفع."
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================================
    // 6. حماية Top-up: مقتصر على pro و enterprise فقط
    // ============================================================
    if (planId === "topup" && (currentPlan === "free" || currentPlan === "basic")) {
      return new Response(
        JSON.stringify({ error: "Access Denied: Token purchase is restricted to Pro and Enterprise plans." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================================
    // 7. الكشف الجغرافي عبر IPAPI
    //
    // displayCurrency: عملة العرض في الواجهة (أي عملة محلية)
    // billingCurrency: العملة التي ترسل لفواتيرك (مدعومة فقط)
    //
    // إذا كانت displayCurrency مدعومة في فواتيرك:
    //   billingCurrency = displayCurrency
    // إذا لم تكن مدعومة (EUR, GBP, TRY, CAD...):
    //   billingCurrency = USD (fallback آمن)
    // ============================================================
    let displayCurrency = "USD";
    let billingCurrency = "USD";
    let userCountryCode = "US";
    let isEgyptianUser  = false;

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";

    try {
      const ipapiRes  = await fetch(
        `http://api.ipapi.com/api/${clientIp}?access_key=${IPAPI_API_KEY}&fields=country_code`
      );
      const ipapiData = await ipapiRes.json();

      if (ipapiData?.country_code) {
        userCountryCode = ipapiData.country_code;
        isEgyptianUser  = userCountryCode === "EG";

        const currencyMap: Record<string, string> = {
          // الشرق الأوسط وشمال أفريقيا
          "EG": "EGP", "SA": "SAR", "AE": "AED", "KW": "KWD",
          "QA": "QAR", "BH": "BHD", "OM": "OMR", "JO": "JOD",
          "IQ": "IQD", "SY": "SYP", "SD": "SDG", "MA": "MAD",
          "DZ": "DZD",
          // أوروبا
          "TR": "TRY", "BA": "BAM", "RO": "RON", "MD": "MDL",
          "GB": "GBP",
          "DE": "EUR", "FR": "EUR", "IT": "EUR", "ES": "EUR",
          "NL": "EUR", "BE": "EUR", "AT": "EUR", "PT": "EUR",
          "FI": "EUR", "IE": "EUR", "GR": "EUR", "LU": "EUR",
          "MT": "EUR", "CY": "EUR", "SK": "EUR", "SI": "EUR",
          "EE": "EUR", "LV": "EUR", "LT": "EUR", "HR": "EUR",
          // أمريكا الشمالية
          "CA": "CAD",
        };

        displayCurrency = currencyMap[userCountryCode] || "USD";
        billingCurrency = FAWATERAK_SUPPORTED_CURRENCIES.has(displayCurrency)
          ? displayCurrency
          : "USD";
      }
    } catch (geoError) {
      console.error("IPAPI Geolocation failed. Falling back to USD.", geoError);
    }

    // ============================================================
    // 8. الأسعار الثابتة بالدولار (Single Source of Truth)
    // ============================================================
    const planPricing: Record<string, { monthly: number; annual: number }> = {
      basic:      { monthly: 5,  annual: 48  },
      pro:        { monthly: 19, annual: 182 },
      enterprise: { monthly: 65, annual: 624 },
      topup:      { monthly: 15, annual: 15  },
    };

    const plan = planPricing[planId];
    if (!plan) throw new Error("Invalid pricing tier requested.");

    const amountUSD =
      planId === "topup" ? plan.monthly : isAnnual ? plan.annual : plan.monthly;

    // ============================================================
    // 9. تحويل العملة عبر Fixer API
    //
    // base currency في Fixer = EUR دائماً (الخطة المجانية)
    //
    // المعادلة:
    //   amountInEUR  = amountUSD / rates.USD
    //   amountTarget = amountInEUR * rates.TARGET
    //
    // نحسب مبلغين في استدعاء واحد:
    //   displayAmount → بعملة المستخدم (للعرض في الواجهة فقط)
    //   billingAmount → بالعملة المدعومة في فواتيرك (للدفع الفعلي)
    // ============================================================
    let displayAmount = amountUSD;
    let billingAmount = amountUSD;

    const needsConversion = displayCurrency !== "USD" || billingCurrency !== "USD";

    if (needsConversion) {
      try {
        const symbolsNeeded = new Set(["USD"]);
        if (displayCurrency !== "USD") symbolsNeeded.add(displayCurrency);
        if (billingCurrency  !== "USD") symbolsNeeded.add(billingCurrency);

        const fixerRes  = await fetch(
          `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&symbols=${[...symbolsNeeded].join(",")}`
        );
        const fixerData = await fixerRes.json();

        if (fixerData.success) {
          const usdRate = fixerData.rates["USD"];

          if (displayCurrency !== "USD" && fixerData.rates[displayCurrency]) {
            displayAmount = Number(
              ((amountUSD / usdRate) * fixerData.rates[displayCurrency]).toFixed(2)
            );
          }

          if (billingCurrency !== "USD" && fixerData.rates[billingCurrency]) {
            billingAmount = Number(
              ((amountUSD / usdRate) * fixerData.rates[billingCurrency]).toFixed(2)
            );
          }

        } else {
          console.warn("Fixer API failed. Falling back to USD.");
          billingCurrency = "USD";
          billingAmount   = amountUSD;
          displayAmount   = amountUSD;
        }
      } catch (fixerError) {
        console.error("Fixer API exception. Falling back to USD.", fixerError);
        billingCurrency = "USD";
        billingAmount   = amountUSD;
        displayAmount   = amountUSD;
      }
    }

    const planLabel =
      planId === "topup"
        ? "QIRAA Mind Top-up (100 tokens)"
        : `QIRAA ${planId.toUpperCase()} Plan`;

    // ============================================================
    // 10. تحديد payment_method_id النهائي
    //
    // IDs فواتيرك:
    // 2  → Credit/Debit Card  (متاح للجميع)
    // 3  → Fawry              (مصر فقط)
    // 11 → Mobile Wallets     (مصر فقط)
    // 14 → Aman               (مصر فقط)
    // 15 → Basata / Masary    (مصر فقط)
    //
    // القاعدة الأمنية: Backend يتحقق من الدولة ويرفض
    // أي method_id مصري إذا كان المستخدم خارج مصر
    // ============================================================
    const egyptianMethodIds = [2, 3, 11, 14, 15];
    let finalPaymentMethodId = 2;

    if (isEgyptianUser && egyptianMethodIds.includes(Number(paymentMethodId))) {
      finalPaymentMethodId = Number(paymentMethodId);
    }

    // ============================================================
    // 11. هندسة حمولة فواتيرك
    //
    // redirectOption: true → فواتيرك ترجع redirectTo موحد
    // لجميع طرق الدفع بما فيها فوري وأمان وبساطة
    // الواجهة تنفذ window.location.href فقط — لا شيء آخر
    // ============================================================
    const fawaterakPayload = {
      payment_method_id: finalPaymentMethodId,
      cartTotal:  billingAmount,
      currency:   billingCurrency,
      customer: {
        first_name: userProfile?.full_name?.split(" ")[0] || "QIRAA",
        last_name:  userProfile?.full_name?.split(" ")[1] || "User",
        email:      user.email,
        phone:      finalPhone,
        address:    "N/A",
      },
      redirectOption: true,
      redirectionUrls: {
        successUrl: "https://qiraabusiness.lovable.app/payment/success",
        failUrl:    "https://qiraabusiness.lovable.app/payment/fail",
        pendingUrl: "https://qiraabusiness.lovable.app/payment/pending",
      },
      cartItems: [{ name: planLabel, price: billingAmount, quantity: 1 }],
    };

    // ============================================================
    // 12. إرسال الطلب لفواتيرك
    // ============================================================
    const invoiceRes = await fetch("https://app.fawaterk.com/api/v2/invoiceInitPay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FAWATERAK_API_KEY}`,
      },
      body: JSON.stringify(fawaterakPayload),
    });

    const invoiceData = await invoiceRes.json();

    if (!invoiceRes.ok || invoiceData.status !== "success") {
      throw new Error(`Fawaterak Gateway Error: ${JSON.stringify(invoiceData)}`);
    }

    // ============================================================
    // 13. تسجيل المعاملة في جدول payments
    //
    // is_annual محفوظة هنا بشكل صريح وموثوق
    // الـ Webhook يقرأها لاحقاً لتحديد مدة الاشتراك
    // بدون أي تخمين من المبلغ أو أي منطق هش
    // ============================================================
    const providerTag = planId === "topup" ? "fawaterak_topup" : "fawaterak";

    await supabase.from("payments").insert({
      user_id:           user.id,
      amount:            billingAmount,
      currency:          billingCurrency,
      subscription_plan: planId === "topup" ? currentPlan : planId,
      payment_status:    "pending",
      payment_provider:  providerTag,
      payment_id:        invoiceData.data?.invoice_id?.toString() || null,
      is_annual:         planId === "topup" ? false : (isAnnual ?? false),
    });

    // ============================================================
    // 14. الاستجابة للواجهة
    //
    // payment_url      → الواجهة تنفذ window.location.href فوراً
    // display_amount   → لعرض "أنت ستدفع X بعملتك" قبل التحويل
    // display_currency → عملة المستخدم المحلية للعرض
    // billing_amount   → المبلغ الفعلي الذي رُسِل لفواتيرك
    // billing_currency → العملة الفعلية في فواتيرك
    // ============================================================
    return new Response(
      JSON.stringify({
        payment_url:      invoiceData.data?.payment_data?.redirectTo,
        invoice_id:       invoiceData.data?.invoice_id,
        display_amount:   displayAmount,
        display_currency: displayCurrency,
        billing_amount:   billingAmount,
        billing_currency: billingCurrency,
        detected_country: userCountryCode,
        is_egyptian_user: isEgyptianUser,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Checkout Exception:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
