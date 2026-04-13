import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-forwarded-for",
};

const SUPPORTED_GEO_COUNTRIES = new Set(["EG", "SA", "AE", "KW", "QA", "BH"]);

const CURRENCY_MAP: Record<string, string> = {
  EG: "EGP", SA: "SAR", AE: "AED", KW: "KWD", QA: "QAR", BH: "BHD",
};

const BASE_PRICES_USD = {
  basic: { monthly: 5, annual: 48 },
  pro: { monthly: 19, annual: 182 },
  enterprise: { monthly: 65, annual: 624 },
  topup: { monthly: 15, annual: 15 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const FIXER_API_KEY = Deno.env.get("FIXER_API_KEY");
    const IPAPI_API_KEY = Deno.env.get("IPAPI_API_KEY");

    if (!FIXER_API_KEY || !IPAPI_API_KEY) {
      return new Response(
        JSON.stringify({ country_code: "US", currency: "USD", prices: BASE_PRICES_USD, is_egyptian: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";

    let countryCode = "US";
    try {
      const ipapiRes = await fetch(
        `http://api.ipapi.com/api/${clientIp}?access_key=${IPAPI_API_KEY}&fields=country_code`
      );
      const ipapiData = await ipapiRes.json();
      if (ipapiData?.country_code) countryCode = ipapiData.country_code;
    } catch {
      console.error("IPAPI failed, defaulting to US");
    }

    const localCurrency = CURRENCY_MAP[countryCode] || null;
    const isEgyptian = countryCode === "EG";
    const needsConversion = SUPPORTED_GEO_COUNTRIES.has(countryCode) && localCurrency;

    if (!needsConversion) {
      return new Response(
        JSON.stringify({
          country_code: countryCode,
          currency: "USD",
          prices: BASE_PRICES_USD,
          is_egyptian: isEgyptian,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert prices
    try {
      const fixerRes = await fetch(
        `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&symbols=USD,${localCurrency}`
      );
      const fixerData = await fixerRes.json();

      if (fixerData.success && fixerData.rates?.USD && fixerData.rates?.[localCurrency]) {
        const usdRate = fixerData.rates.USD;
        const targetRate = fixerData.rates[localCurrency];
        const convert = (usd: number) => Number(((usd / usdRate) * targetRate).toFixed(2));

        const convertedPrices: Record<string, { monthly: number; annual: number }> = {};
        for (const [key, val] of Object.entries(BASE_PRICES_USD)) {
          convertedPrices[key] = { monthly: convert(val.monthly), annual: convert(val.annual) };
        }

        return new Response(
          JSON.stringify({
            country_code: countryCode,
            currency: localCurrency,
            prices: convertedPrices,
            is_egyptian: isEgyptian,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch {
      console.error("Fixer API failed");
    }

    return new Response(
      JSON.stringify({ country_code: countryCode, currency: "USD", prices: BASE_PRICES_USD, is_egyptian: isEgyptian }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("geo-pricing error:", error);
    return new Response(
      JSON.stringify({ country_code: "US", currency: "USD", prices: BASE_PRICES_USD, is_egyptian: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
