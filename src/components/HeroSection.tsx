import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Users, Brain, Shield } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
const HeroSection = () => {
  return <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/20 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-right space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  منصة قراءة
                </span>
                <br />
                للذكاء الاصطناعي
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">بوابتك الذكية لتحليل الأسواق و الاستثمارات في منطقة الشرق الأوسط و شمال أفريقيا</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
              <Button variant="hero" size="xl" className="group">
                ابدأ التجربة المجانية
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                شاهد العرض التوضيحي
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center lg:text-right">
                <div className="text-3xl font-bold text-primary">1200+</div>
                <div className="text-sm text-muted-foreground">تحليل شهري</div>
              </div>
              <div className="text-center lg:text-right">
              <div className="text-3xl font-bold text-success">20+</div>
                <div className="text-sm text-muted-foreground">قطاع استثماري</div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-3xl font-bold text-premium">500+</div>
                <div className="text-sm text-muted-foreground">بيانات شركة ناشئة</div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-3xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground">متابعة مستمرة</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={heroImage} alt="QIRAA AI Platform" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-card p-4 rounded-lg shadow-lg border">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">نمو 125%</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-lg shadow-lg border">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">AI تحليل ذكي</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4 bg-card/50 p-6 rounded-lg">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">تقارير استراتيجية</h3>
              <p className="text-sm text-muted-foreground">تحليلات استراتيجية و قطاعية دقيقة</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-card/50 p-6 rounded-lg">
            <div className="bg-success/10 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">تحليلات لحظية</h3>
              <p className="text-sm text-muted-foreground">موجزات ذكية محدثة باستمرار</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-card/50 p-6 rounded-lg">
            <div className="bg-premium/10 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-premium" />
            </div>
            <div>
              <h3 className="font-semibold">أمان عالي</h3>
              <p className="text-sm text-muted-foreground">حماية متقدمة لبياناتك الاستثمارية</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;