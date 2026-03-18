import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FAWATERAK_API_KEY = Deno.env.get("FAWATERAK_API_KEY");
    const FAWATERAK_PROVIDER_KEY = Deno.env.get("FAWATERAK_PROVIDER_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!FAWATERAK_API_KEY || !FAWATERAK_PROVIDER_KEY) {
      throw new Error("Fawaterak keys not configured");
    }

    // Auth check
    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { planId, isAnnual } = await req.json();

    // Plan pricing in USD
    const planPricing: Record<string, { monthly: number; annual: number; tokens: number }> = {
      basic: { monthly: 5, annual: 48, tokens: 0 },
      pro: { monthly: 19, annual: 182, tokens: 50 },
      enterprise: { monthly: 65, annual: 624, tokens: 250 },
      topup: { monthly: 15, annual: 15, tokens: 100 },
    };

    const plan = planPricing[planId];
    if (!plan) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amount = planId === "topup" ? plan.monthly : (isAnnual ? plan.annual : plan.monthly);
    const planLabel = planId === "topup" ? "QIRAA Mind Top-up (100 tokens)" : `QIRAA ${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan${isAnnual ? " (Annual)" : " (Monthly)"}`;

    // Create Fawaterak invoice
    const invoiceRes = await fetch("https://app.fawaterk.com/api/v2/invoiceInitPay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FAWATERAK_API_KEY}`,
      },
      body: JSON.stringify({
        payment_method_id: FAWATERAK_PROVIDER_KEY,
        cartTotal: amount.toString(),
        currency: "USD",
        customer: {
          first_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer",
          last_name: ".",
          email: user.email,
          phone: "0000000000",
          address: "N/A",
        },
        redirectionUrls: {
          successUrl: "https://qiraabusiness.lovable.app/payment/success",
          failUrl: "https://qiraabusiness.lovable.app/payment/fail",
        },
        cartItems: [
          {
            name: planLabel,
            price: amount.toString(),
            quantity: "1",
          },
        ],
      }),
    });

    const invoiceData = await invoiceRes.json();
    console.log("Fawaterak response:", JSON.stringify(invoiceData));

    if (!invoiceRes.ok || invoiceData.status !== "success") {
      throw new Error(`Fawaterak error: ${JSON.stringify(invoiceData)}`);
    }

    // Store pending payment
    const subscriptionPlan = planId === "topup" ? "pro" : planId;
    await supabase.from("payments").insert({
      user_id: user.id,
      amount,
      subscription_plan: subscriptionPlan,
      payment_status: "pending",
      payment_provider: "fawaterak",
      payment_id: invoiceData.data?.invoice_id?.toString() || null,
    });

    return new Response(
      JSON.stringify({
        payment_url: invoiceData.data?.payment_data?.redirectTo || invoiceData.data?.url,
        invoice_id: invoiceData.data?.invoice_id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
