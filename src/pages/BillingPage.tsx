import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Zap, Crown, Plus, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BillingPage = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(0);
  const [usedTokens, setUsedTokens] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);
  const [plan, setPlan] = useState("free");

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate("/auth");
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("qiraa_mind_tokens, subscription_plan")
      .eq("user_id", session.user.id)
      .single();
    if (data) {
      setTokens((data as any).qiraa_mind_tokens || 0);
      setPlan(data.subscription_plan || "free");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleMockPurchase = async (packageName: string, tokenAmount: number, price: number) => {
    setLoading(packageName);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const { data: current } = await supabase
        .from("profiles")
        .select("qiraa_mind_tokens")
        .eq("user_id", session.user.id)
        .single();

      const currentTokens = (current as any)?.qiraa_mind_tokens || 0;

      await supabase
        .from("profiles")
        .update({ qiraa_mind_tokens: currentTokens + tokenAmount } as any)
        .eq("user_id", session.user.id);

      // Record payment
      await supabase.from("payments").insert({
        user_id: session.user.id,
        amount: price,
        subscription_plan: packageName === "personal" ? "pro" : packageName === "enterprise" ? "enterprise" : "pro",
        payment_status: "completed",
        payment_provider: "mock",
      });

      setTokens(currentTokens + tokenAmount);
      toast({
        title: isRTL ? "تم الشراء بنجاح!" : "Purchase Successful!",
        description: isRTL ? `تمت إضافة ${tokenAmount} سؤال إلى رصيدك` : `${tokenAmount} tokens added to your balance`,
      });
    } catch (e: any) {
      toast({ title: isRTL ? "خطأ" : "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const maxTokens = Math.max(tokens, 50);
  const progressPercent = Math.min((tokens / maxTokens) * 100, 100);

  const plans = [
    {
      id: "personal",
      name: isRTL ? "الباقة الشخصية" : "Personal Plan",
      price: 19,
      tokens: 50,
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
      features: isRTL
        ? ["50 سؤال لـ QIRAA Mind", "تحليلات استراتيجية", "تقارير مفصلة"]
        : ["50 QIRAA Mind queries", "Strategic analyses", "Detailed reports"],
    },
    {
      id: "enterprise",
      name: isRTL ? "باقة المؤسسات" : "Enterprise Plan",
      price: 65,
      tokens: 250,
      icon: Crown,
      color: "from-primary to-amber-500",
      popular: true,
      features: isRTL
        ? ["250 سؤال لـ QIRAA Mind", "دعم ذو أولوية", "تحليلات متقدمة", "تقارير حصرية"]
        : ["250 QIRAA Mind queries", "Priority support", "Advanced analytics", "Exclusive reports"],
    },
    {
      id: "topup",
      name: isRTL ? "توكنات إضافية" : "Top-up Tokens",
      price: 15,
      tokens: 100,
      icon: Plus,
      color: "from-emerald-500 to-teal-500",
      features: isRTL
        ? ["100 سؤال إضافي", "لا تنتهي صلاحيتها", "تُضاف فوراً لرصيدك"]
        : ["100 additional queries", "Credits never expire", "Added instantly"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {isRTL ? "الباقات والاشتراكات" : "Billing & Subscriptions"}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {isRTL ? "اختر الباقة المناسبة لاحتياجاتك واستفد من تحليلات QIRAA Mind الاستراتيجية" : "Choose the right plan for your needs and unlock QIRAA Mind strategic insights"}
          </p>
        </div>

        {/* Token Balance Card */}
        <Card className="mb-10 border-primary/20 max-w-lg mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" />
              {isRTL ? "رصيدك الحالي" : "Your Token Balance"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold text-foreground font-mono">{tokens}</span>
              <span className="text-muted-foreground text-sm mb-1">{isRTL ? "سؤال متبقي" : "queries remaining"}</span>
            </div>
            <Progress value={progressPercent} className="h-2.5 mb-2" />
            <p className="text-xs text-muted-foreground">
              {isRTL ? `الباقة الحالية: ${plan}` : `Current plan: ${plan}`}
            </p>
          </CardContent>
        </Card>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card key={p.id} className={`relative overflow-hidden transition-all hover:shadow-xl ${p.popular ? "border-primary ring-2 ring-primary/20 scale-[1.02]" : "border-border"}`}>
              {p.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-amber-500 text-primary-foreground text-xs text-center py-1 font-semibold">
                  {isRTL ? "الأكثر شعبية" : "MOST POPULAR"}
                </div>
              )}
              <CardHeader className={`${p.popular ? "pt-10" : "pt-6"}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4`}>
                  <p.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{p.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-foreground">${p.price}</span>
                  <span className="text-muted-foreground text-sm">
                    {p.id === "topup" ? (isRTL ? "/ مرة واحدة" : "/ one-time") : (isRTL ? "/ شهرياً" : "/ month")}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={p.popular ? "default" : "outline"}
                  disabled={loading === p.id}
                  onClick={() => handleMockPurchase(p.id, p.tokens, p.price)}
                >
                  {loading === p.id ? (
                    <Loader2Icon />
                  ) : p.id === "topup" ? (
                    isRTL ? "شراء التوكنات" : "Buy Tokens"
                  ) : (
                    isRTL ? "اشترك الآن" : "Subscribe Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Small loader for button
const Loader2Icon = () => <Loader2 className="h-4 w-4 animate-spin" />;

import { Loader2 } from "lucide-react";

export default BillingPage;
