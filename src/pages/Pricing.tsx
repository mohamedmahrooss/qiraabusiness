import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Building2, TrendingUp } from "lucide-react";
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
        isRTL ? "لا يشمل مؤشرات قراءة" : "No QIRAA Signals access",
        isRTL ? "3 تحليلات يومية فقط و 20 شهرياً" : "Limited to 3 daily & 20 monthly analyses"
      ],
      buttonText: t.getStarted,
      variant: "outline" as const,
      popular: false
    },
    {
      name: t.basicPlan,
      nameEn: "Basic", 
      price: { monthly: 5, annual: 48 },
      description: t.basicPlanDesc,
      icon: TrendingUp,
      features: [
        isRTL ? "10 تحليلات يومية" : "10 daily analyses",
        isRTL ? "فلترة حسب القطاعات" : "Sector filtering",
        isRTL ? "دعم أولوية" : "Priority support"
      ],
      limitations: [
        isRTL ? "لا يشمل التقارير الاستراتيجية" : "No strategic reports",
        isRTL ? "لا يشمل مؤشرات قراءة" : "No QIRAA Signals access"
      ],
      buttonText: t.subscribeNow,
      variant: "default" as const,
      popular: false
    },
    {
      name: t.proPlan,
      nameEn: "Pro",
      price: { monthly: 19, annual: 182 },
      description: t.proPlanDesc,
      icon: Crown,
      features: [
        isRTL ? "تحليلات غير محدودة" : "Unlimited analyses",
        isRTL ? "جميع التقارير الاستراتيجية" : "All strategic reports",
        isRTL ? "تحليلات قطاعية متخصصة" : "Specialized sector analysis",
        isRTL ? "دعم مباشر 24/7" : "24/7 direct support",
        isRTL ? "تنبيهات فورية" : "Instant alerts",
        isRTL ? "الوصول إلى مؤشرات قراءة" : "QIRAA Signals Access",
        isRTL ? "عرض شهري وسنوي للبيانات" : "Monthly & Annual data views",
        isRTL ? "رسوم بيانية تفاعلية" : "Interactive charts",
        isRTL ? "تصدير البيانات CSV" : "CSV data export",
        isRTL ? "🧠 عقل قراءة - مساعد ذكي" : "🧠 QIRAA Mind - AI Assistant"
      ],
      limitations: [],
      buttonText: t.subscribeToPro,
      variant: "default" as const,
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
        isRTL ? "رؤى وتنبؤات الذكاء الاصطناعي" : "AI Insights & Forecasting",
        isRTL ? "مقارنة حتى 5 شركات" : "Compare up to 5 companies",
        isRTL ? "تحليل الحصة السوقية" : "Market Share Analysis",
        isRTL ? "مؤشرات متعددة الدول" : "Multi-country insights",
        isRTL ? "تحديث البيانات الأولوي" : "Priority data refresh",
        isRTL ? "واجهة API متقدمة" : "Advanced API access",
        isRTL ? "تقارير مخصصة" : "Custom reports",
        isRTL ? "تكامل مع أنظمة CRM" : "CRM integration"
      ],
      limitations: [],
      buttonText: t.contactSales,
      variant: "default" as const,
      popular: false
    }
  ];

  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <div className="bg-gray-50">
        <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t.choosePlan}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {t.pricingSubtitle}
            </p>
            
            {/* Pricing Toggle - الكود المُصلح تماماً */}
            <div className="flex items-center justify-center mb-8">
              {isRTL ? (
                /* النسخة العربية - الترتيب: شهري (يمين) - زر - سنوي (يسار) */
                <div className="flex items-center gap-3">
                  {/* شهري - على اليمين */}
                  <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
                    {t.monthlyPricing}
                  </span>

                  {/* Toggle Button - RTL */}
                  <button
                    onClick={togglePricing}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isAnnual ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label="Toggle pricing"
                  >
                    <span
                      style={{
                        transform: isAnnual ? 'translateX(-32px)' : 'translateX(2px)'
                      }}
                      className="inline-block h-5 w-5 rounded-full bg-white transition-transform duration-300 ease-in-out shadow-md"
                    />
                  </button>

                  {/* سنوي - على اليسار مع الباج */}
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
                      {t.annualPricing}
                    </span>
                    <div className={`transition-all duration-300 ${isAnnual ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                      {isAnnual && (
                        <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200 px-2 py-0.5">
                          {isRTL ? "وفر 20%" : "Save 20%"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* النسخة الإنجليزية - الترتيب: Monthly (يسار) - Toggle - Annually (يمين) */
                <div className="flex items-center gap-3">
                  {/* Monthly - على اليسار */}
                  <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
                    {t.monthlyPricing}
                  </span>

                  {/* Toggle Button - LTR */}
                  <button
                    onClick={togglePricing}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isAnnual ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label="Toggle pricing"
                  >
                    <span
                      style={{
                        transform: isAnnual ? 'translateX(32px)' : 'translateX(2px)'
                      }}
                      className="inline-block h-5 w-5 rounded-full bg-white transition-transform duration-300 ease-in-out shadow-md"
                    />
                  </button>

                  {/* Annually - على اليمين مع الباج */}
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
                      {t.annualPricing}
                    </span>
                    <div className={`transition-all duration-300 ${isAnnual ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                      {isAnnual && (
                        <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200 px-2 py-0.5">
                          {isRTL ? "وفر 20%" : "Save 20%"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
                  className={`relative bg-white ${plan.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : 'border border-gray-200'} hover:shadow-2xl transition-all duration-300 rounded-xl`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1">
                      {t.mostPopular}
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-4 ${
                      plan.popular ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">{plan.description}</CardDescription>
                    
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">
                        ${price}
                      </span>
                      <span className="text-gray-600 text-base">
                        /{period}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {plan.limitations.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2 font-medium">
                          {isRTL ? "القيود:" : "Limitations:"}
                        </p>
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="flex items-start gap-2 mb-1">
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className={`w-full font-medium ${
                        plan.popular 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6 text-lg">
              {t.moneyBackGuarantee}
            </p>
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">{t.noSetupFees}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">{t.cancelAnytime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">{t.instantSupport}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;