import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Building2, TrendingUp } from "lucide-react";
const PricingSection = () => {
  const plans = [{
    name: "المجانية",
    nameEn: "Free",
    price: "0",
    description: "للمبتدئين ورواد الأعمال الجدد",
    icon: Star,
    features: ["3 تحليلات يومية", "20 مقال شهرياً", "الوصول للمحتوى العام", "دعم عبر البريد الإلكتروني"],
    limitations: ["لا يشمل التقارير الاستراتيجية", "لا يشمل مؤشرات قراءة", "3 تحليلات يومية فقط و 20 شهرياً"],
    buttonText: "ابدأ مجاناً",
    variant: "outline" as const,
    popular: false
  }, {
    name: "الأساسية",
    nameEn: "Basic",
    price: "5",
    description: "للمستثمرين الأفراد والشركات الناشئة",
    icon: TrendingUp,
    features: ["10 تحليلات يومية", "فلترة حسب القطاعات", "دعم أولوية"],
    limitations: ["لا يشمل التقارير الاستراتيجية", "لا يشمل مؤشرات قراءة"],
    buttonText: "اشترك الآن",
    variant: "default" as const,
    popular: false
  }, {
    name: "الاحترافية",
    nameEn: "Pro",
    price: "19",
    description: "للمستثمرين المحترفين والمؤسسات المتوسطة",
    icon: Crown,
    features: ["تحليلات غير محدودة", "جميع التقارير الاستراتيجية", "تحليلات قطاعية متخصصة", "دعم مباشر 24/7", "تنبيهات فورية", "🚀 الوصول إلى مؤشرات قراءة", "📊 عرض شهري وسنوي للبيانات", "📈 رسوم بيانية تفاعلية", "📄 تصدير البيانات CSV", "🧠 عقل قراءة - مساعد ذكي"],
    limitations: [],
    buttonText: "اشترك في الاحترافية",
    variant: "premium" as const,
    popular: true
  }, {
    name: "المؤسسية",
    nameEn: "Enterprise",
    price: "65",
    description: "للمؤسسات الكبيرة وصناديق الاستثمار",
    icon: Building2,
    features: ["جميع مزايا الاحترافية", "🧠 رؤى وتنبؤات الذكاء الاصطناعي", "🔄 مقارنة حتى 5 شركات", "📊 تحليل الحصة السوقية", "🌍 مؤشرات متعددة الدول", "⚡ تحديث البيانات الأولوي", "🔗 واجهة API متقدمة", "🎯 تقارير مخصصة", "🔗 تكامل مع أنظمة CRM"],
    limitations: [],
    buttonText: "تواصل معنا",
    variant: "hero" as const,
    popular: false
  }];
  return <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            اختر الباقة المناسبة لك
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            باقات مرنة تناسب جميع احتياجاتك الاستثمارية من البداية حتى المؤسسات الكبيرة
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => {
          const IconComponent = plan.icon;
          return <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    الأكثر شعبية
                  </Badge>}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-4 ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> ريال/شهر</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>)}
                  </div>
                  
                  {plan.limitations.length > 0 && <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">القيود:</p>
                      {plan.limitations.map((limitation, limitIndex) => <div key={limitIndex} className="flex items-start space-x-3">
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{limitation}</span>
                        </div>)}
                    </div>}
                </CardContent>

                <CardFooter>
                  <Button variant={plan.variant} className="w-full" size="lg">
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>;
        })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            جميع الباقات تشمل ضمان استرداد المال خلال 30 يوماً
          </p>
          <div className="flex justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm">بدون رسوم إعداد</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm">إلغاء في أي وقت</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm">دعم فني لحظي</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default PricingSection;