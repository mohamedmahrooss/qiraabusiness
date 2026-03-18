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
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    console.log("Fawaterak paid webhook:", JSON.stringify(body));

    const invoiceId = body.invoice_id?.toString() || body.data?.invoice_id?.toString();
    if (!invoiceId) {
      return new Response(JSON.stringify({ error: "No invoice_id" }), { status: 400, headers: corsHeaders });
    }

    // Find the pending payment
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("payment_id", invoiceId)
      .eq("payment_status", "pending")
      .single();

    if (paymentError || !payment) {
      console.error("Payment not found for invoice:", invoiceId, paymentError);
      return new Response(JSON.stringify({ error: "Payment not found" }), { status: 404, headers: corsHeaders });
    }

    // Update payment status to completed
    await supabase
      .from("payments")
      .update({ payment_status: "completed" })
      .eq("id", payment.id);

    // Update user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("qiraa_mind_tokens, subscription_plan")
      .eq("user_id", payment.user_id)
      .single();

    const currentTokens = (profile as any)?.qiraa_mind_tokens || 0;
    const plan = payment.subscription_plan as string;

    // Determine tokens to add
    const tokenMap: Record<string, number> = { pro: 50, enterprise: 250 };
    // Check if this is a topup (pro plan but amount is 15)
    const isTopup = plan === "pro" && payment.amount === 15;
    const tokensToAdd = isTopup ? 100 : (tokenMap[plan] || 0);

    const updateData: any = {
      qiraa_mind_tokens: currentTokens + tokensToAdd,
    };

    // Only update subscription plan if not a topup
    if (!isTopup) {
      updateData.subscription_plan = plan;
      updateData.subscription_start_date = new Date().toISOString();
      // Set end date based on amount (annual vs monthly)
      const isAnnual = payment.amount > 50 || (plan === "basic" && payment.amount >= 48);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (isAnnual ? 12 : 1));
      updateData.subscription_end_date = endDate.toISOString();
    }

    await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", payment.user_id);

    console.log("Payment completed for user:", payment.user_id, "plan:", plan, "tokens added:", tokensToAdd);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
