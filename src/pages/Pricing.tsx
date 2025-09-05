import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Building2, TrendingUp, Zap } from "lucide-react";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";

const Pricing = () => {
  const { isRTL } = useLanguage();
  const t = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: t.freePlan,
      nameEn: "Free",
      price: { monthly: 0, annual: 0 },
      description: t.freePlanDesc,
      icon: Star,
      features: [
        isRTL ? "3 تحليلات يومية" : "3 daily analyses",
        isRTL ? "20 مقال شهرياً" : "20 articles monthly",
        isRTL ? "الوصول للمحتوى العام" : "Public content access",
        isRTL ? "دعم عبر البريد الإلكتروني" : "Email support"
      ],
      limitations: [
        isRTL ? "لا يشمل التقارير الاستراتيجية" : "No strategic reports",
        isRTL ? "لا يشمل QIRAA Signals" : "No QIRAA Signals access"
      ],
      buttonText: t.getStarted,
      variant: "outline" as const,
      popular: false
    },
    {
      name: t.basicPlan,
      nameEn: "Basic", 
      price: { monthly: 2.5, annual: 24 },
      description: t.basicPlanDesc,
      icon: TrendingUp,
      features: [
        isRTL ? "10 تحليلات يومية" : "10 daily analyses",
        isRTL ? "مقالات غير محدودة" : "Unlimited articles",
        isRTL ? "أرشيف المحتوى" : "Content archive",
        isRTL ? "فلترة حسب القطاعات" : "Sector filtering",
        isRTL ? "دعم أولوية" : "Priority support"
      ],
      limitations: [
        isRTL ? "لا يشمل التقارير الاستراتيجية" : "No strategic reports",
        isRTL ? "لا يشمل QIRAA Signals" : "No QIRAA Signals access"
      ],
      buttonText: t.subscribeNow,
      variant: "default" as const,
      popular: false
    },
    {
      name: t.proPlan,
      nameEn: "Pro",
      price: { monthly: 9, annual: 86 },
      description: t.proPlanDesc,
      icon: Crown,
      features: [
        isRTL ? "تحليلات غير محدودة" : "Unlimited analyses",
        isRTL ? "جميع التقارير الاستراتيجية" : "All strategic reports",
        isRTL ? "تحميل المحتوى كـ PDF" : "PDF downloads",
        isRTL ? "تحليلات قطاعية متخصصة" : "Specialized sector analysis",
        isRTL ? "دعم مباشر 24/7" : "24/7 direct support",
        isRTL ? "تنبيهات فورية" : "Instant alerts",
        isRTL ? "الوصول إلى QIRAA Signals" : "QIRAA Signals Access",
        isRTL ? "عرض شهري وسنوي للبيانات" : "Monthly & Annual data views",
        isRTL ? "رسوم بيانية تفاعلية" : "Interactive charts",
        isRTL ? "تصدير البيانات CSV" : "CSV data export"
      ],
      limitations: [],
      buttonText: t.subscribeToPro,
      variant: "premium" as const,
      popular: true
    },
    {
      name: t.enterprisePlan,
      nameEn: "Enterprise",
      price: { monthly: 65, annual: 624 },
      description: t.enterprisePlanDesc,
      icon: Building2,
      features: [
        isRTL ? "جميع مزايا الاحترافية" : "All Pro features",
        isRTL ? "AI Insights & Forecasting" : "AI Insights & Forecasting",
        isRTL ? "مقارنة حتى 5 شركات" : "Compare up to 5 companies",
        isRTL ? "تحليل الحصة السوقية" : "Market Share Analysis",
        isRTL ? "مؤشرات متعددة الدول" : "Multi-country insights",
        isRTL ? "تحديث البيانات الأولوي" : "Priority data refresh",
        isRTL ? "واجهة API متقدمة" : "Advanced API access",
        isRTL ? "تقارير مخصصة" : "Custom reports",
        isRTL ? "مدير حساب مخصص" : "Dedicated account manager",
        isRTL ? "تدريب الفريق" : "Team training",
        isRTL ? "تكامل مع أنظمة CRM" : "CRM integration"
      ],
      limitations: [],
      buttonText: t.contactSales,
      variant: "hero" as const,
      popular: false
    }
  ];

  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t.choosePlan}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t.pricingSubtitle}
            </p>
            
            {/* Pricing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm ${!isAnnual ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {isRTL ? "شهري" : "Monthly"}
              </span>
              <button
                onClick={togglePricing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isAnnual ? 'bg-primary' : 'bg-gray-200'
                }`}
                dir="ltr"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isRTL 
                      ? (isAnnual ? 'translate-x-1' : 'translate-x-6')
                      : (isAnnual ? 'translate-x-6' : 'translate-x-1')
                  }`}
                />
              </button>
              <span className={`text-sm ${isAnnual ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {isRTL ? "سنوي" : "Annually"}
                {isAnnual && (
                  <Badge variant="secondary" className={`${isRTL ? 'mr-2' : 'ml-2'}`}>
                    {isRTL ? "وفر 20%" : "Save 20%"}
                  </Badge>
                )}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              const price = isAnnual ? plan.price.annual : plan.price.monthly;
              const period = isAnnual ? (isRTL ? "سنة" : "year") : (isRTL ? "شهر" : "month");
              
              return (
                <Card 
                  key={index} 
                  className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'} hover:shadow-xl transition-all duration-300`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                      {t.mostPopular}
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-4 ${
                      plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        ${price}
                      </span>
                      <span className="text-muted-foreground">
                        /{period}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {plan.limitations.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2">
                          {isRTL ? "القيود:" : "Limitations:"}
                        </p>
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button variant={plan.variant} className="w-full" size="lg">
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              {t.moneyBackGuarantee}
            </p>
            <div className={`flex justify-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t.noSetupFees}</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t.cancelAnytime}</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t.instantSupport}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;