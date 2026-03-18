import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Building2, TrendingUp, Plus, Loader2 } from "lucide-react";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const { isRTL } = useLanguage();
  const t = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, isAnnualPlan: boolean) => {
    setLoading(planId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("fawaterak-checkout", {
        body: { planId, isAnnual: isAnnualPlan },
      });

      if (error) throw error;
      if (data?.payment_url) {
        window.location.href = data.payment_url;
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (e: any) {
      toast({ title: isRTL ? "خطأ" : "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: "free",
      name: t.freePlan,
      price: { monthly: 0, annual: 0 },
      description: t.freePlanDesc,
      icon: Star,
      subscriptionPlan: "free" as const,
      tokens: 0,
      features: [
        isRTL ? "3 تحليلات يومية" : "3 daily analyses",
        isRTL ? "20 مقال شهرياً" : "20 articles monthly",
        isRTL ? "الوصول للمحتوى العام" : "Public content access",
        isRTL ? "دعم عبر البريد الإلكتروني" : "Email support",
      ],
      limitations: [
        isRTL ? "لا يشمل التقارير الاستراتيجية" : "No strategic reports",
        isRTL ? "لا يشمل مؤشرات قراءة" : "No QIRAA Signals access",
        isRTL ? "لا يشمل QIRAA Mind" : "No QIRAA Mind access",
      ],
      buttonText: t.getStarted,
      popular: false,
    },
    {
      id: "basic",
      name: t.basicPlan,
      price: { monthly: 5, annual: 48 },
      description: t.basicPlanDesc,
      icon: TrendingUp,
      subscriptionPlan: "basic" as const,
      tokens: 0,
      features: [
        isRTL ? "10 تحليلات يومية" : "10 daily analyses",
        isRTL ? "فلترة حسب القطاعات" : "Sector filtering",
        isRTL ? "دعم أولوية" : "Priority support",
      ],
      limitations: [
        isRTL ? "لا يشمل التقارير الاستراتيجية" : "No strategic reports",
        isRTL ? "لا يشمل مؤشرات قراءة" : "No QIRAA Signals access",
        isRTL ? "لا يشمل QIRAA Mind" : "No QIRAA Mind access",
      ],
      buttonText: t.subscribeNow,
      popular: false,
    },
    {
      id: "pro",
      name: t.proPlan,
      price: { monthly: 19, annual: 182 },
      description: t.proPlanDesc,
      icon: Crown,
      subscriptionPlan: "pro" as const,
      tokens: 50,
      features: [
        isRTL ? "تحليلات غير محدودة" : "Unlimited analyses",
        isRTL ? "جميع التقارير الاستراتيجية" : "All strategic reports",
        isRTL ? "تحليلات قطاعية متخصصة" : "Specialized sector analysis",
        isRTL ? "دعم مباشر 24/7" : "24/7 direct support",
        isRTL ? "تنبيهات فورية" : "Instant alerts",
        isRTL ? "الوصول إلى مؤشرات قراءة" : "QIRAA Signals Access",
        isRTL ? "رسوم بيانية تفاعلية" : "Interactive charts",
        isRTL ? "تصدير البيانات CSV" : "CSV data export",
        isRTL ? "50 سؤال لـ QIRAA Mind شهرياً" : "50 QIRAA Mind queries/month",
      ],
      limitations: [],
      buttonText: t.subscribeToPro,
      popular: true,
    },
    {
      id: "enterprise",
      name: t.enterprisePlan,
      price: { monthly: 65, annual: 624 },
      description: t.enterprisePlanDesc,
      icon: Building2,
      subscriptionPlan: "enterprise" as const,
      tokens: 250,
      features: [
        isRTL ? "جميع مزايا الاحترافية" : "All Pro features",
        isRTL ? "250 سؤال لـ QIRAA Mind شهرياً" : "250 QIRAA Mind queries/month",
        isRTL ? "رؤى وتنبؤات الذكاء الاصطناعي" : "AI Insights & Forecasting",
        isRTL ? "مقارنة حتى 5 شركات" : "Compare up to 5 companies",
        isRTL ? "تحليل الحصة السوقية" : "Market Share Analysis",
        isRTL ? "مؤشرات متعددة الدول" : "Multi-country insights",
        isRTL ? "واجهة API متقدمة" : "Advanced API access",
        isRTL ? "تقارير مخصصة" : "Custom reports",
        isRTL ? "تكامل مع أنظمة CRM" : "CRM integration",
      ],
      limitations: [],
      buttonText: t.contactSales,
      popular: false,
    },
  ];

  const togglePricing = () => setIsAnnual(!isAnnual);

  return (
    <div className="bg-muted/30">
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t.choosePlan}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t.pricingSubtitle}
            </p>

            {/* Pricing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
                  {t.monthlyPricing}
                </span>
                <button
                  onClick={togglePricing}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isAnnual ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  aria-label="Toggle pricing"
                >
                  <span
                    style={{ transform: isAnnual ? (isRTL ? 'translateX(2px)' : 'translateX(32px)') : (isRTL ? 'translateX(32px)' : 'translateX(2px)') }}
                    className="inline-block h-5 w-5 rounded-full bg-background transition-transform duration-300 ease-in-out shadow-md"
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
                    {t.annualPricing}
                  </span>
                  {isAnnual && (
                    <Badge className="text-xs bg-primary/10 text-primary border-primary/20 px-2 py-0.5">
                      {isRTL ? "وفر 20%" : "Save 20%"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              const price = isAnnual ? plan.price.annual : plan.price.monthly;
              const period = isAnnual ? (isRTL ? "سنة" : "year") : (isRTL ? "شهر" : "month");

              return (
                <Card
                  key={plan.id}
                  className={`relative bg-card ${plan.popular ? 'border-2 border-primary shadow-xl scale-105' : 'border border-border'} hover:shadow-2xl transition-all duration-300 rounded-xl`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1">
                      {t.mostPopular}
                    </Badge>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-4 ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">{plan.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">${price}</span>
                      <span className="text-muted-foreground text-base">/{period}</span>
                    </div>
                    {plan.tokens > 0 && (
                      <p className="text-xs text-primary mt-1 font-medium">
                        {isRTL ? `يشمل ${plan.tokens} سؤال QIRAA Mind` : `Includes ${plan.tokens} QIRAA Mind queries`}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {plan.limitations.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2 font-medium">
                          {isRTL ? "القيود:" : "Limitations:"}
                        </p>
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="flex items-start gap-2 mb-1">
                            <span className="text-xs text-muted-foreground/60">•</span>
                            <span className="text-xs text-muted-foreground/60">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button
                      className={`w-full font-medium ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                      disabled={loading === plan.id}
                      onClick={() => {
                        if (plan.id === "free") {
                          navigate("/auth");
                        } else {
                          handleSubscribe(plan.id, isAnnual);
                        }
                      }}
                    >
                      {loading === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Top-up Section */}
          <div className="mt-16 max-w-md mx-auto">
            <Card className="border-primary/20 bg-card">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{isRTL ? "توكنات إضافية" : "Top-up Tokens"}</CardTitle>
                <CardDescription>{isRTL ? "أضف أسئلة إضافية لـ QIRAA Mind" : "Add extra QIRAA Mind queries"}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-foreground">$15</span>
                  <span className="text-muted-foreground text-sm"> / {isRTL ? "مرة واحدة" : "one-time"}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {[
                    isRTL ? "100 سؤال إضافي" : "100 additional queries",
                    isRTL ? "لا تنتهي صلاحيتها" : "Credits never expire",
                    isRTL ? "تُضاف فوراً لرصيدك" : "Added instantly",
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant="outline"
                  disabled={loading === "topup"}
                  onClick={() => handleSubscribe("topup", 100, 15, "pro")}
                >
                  {loading === "topup" ? <Loader2 className="h-4 w-4 animate-spin" /> : isRTL ? "شراء التوكنات" : "Buy Tokens"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer guarantees */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6 text-lg">{t.moneyBackGuarantee}</p>
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">{t.noSetupFees}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">{t.cancelAnytime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">{t.instantSupport}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
