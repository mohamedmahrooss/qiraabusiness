import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Brain, Shield, BarChart3, Globe, Zap, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-primary/90 py-24 lg:py-36">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 text-primary-foreground/90 text-sm">
              <Zap className="h-4 w-4" />
              <span>منصة ذكاء السوق الأولى في المنطقة</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-primary-foreground">
              بوابتك الذكية
              <br />
              <span className="bg-gradient-to-r from-premium to-premium/70 bg-clip-text text-transparent">
                لتحليل الأسواق
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/70 leading-relaxed max-w-3xl mx-auto">
              رؤى وتحليلات وتقارير دقيقة تساعد صانعي القرار والمستثمرين في منطقة الشرق الأوسط وشمال أفريقيا
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="xl" variant="hero" className="group text-lg" asChild>
                <Link to="/auth">
                  ابدأ مجاناً
                  <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/pricing">
                  استعرض الباقات
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            <div className="text-center bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6">
              <div className="text-4xl font-bold text-premium">1200+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">تحليل شهري</div>
            </div>
            <div className="text-center bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6">
              <div className="text-4xl font-bold text-success">20+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">قطاع استثماري</div>
            </div>
            <div className="text-center bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6">
              <div className="text-4xl font-bold text-primary-foreground">500+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">بيانات شركة ناشئة</div>
            </div>
            <div className="text-center bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6">
              <div className="text-4xl font-bold text-primary-glow">24/7</div>
              <div className="text-sm text-primary-foreground/70 mt-1">متابعة مستمرة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              لماذا تختار قراءة؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              أدوات ذكية وتحليلات متقدمة تمنحك ميزة تنافسية في سوق سريع التغير
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Brain className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">تقارير استراتيجية</h3>
              <p className="text-muted-foreground leading-relaxed">
                تحليلات استراتيجية وقطاعية دقيقة تمنحك رؤية شاملة للسوق وفرص الاستثمار
              </p>
            </div>

            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-success/30 transition-all duration-300">
              <div className="bg-success/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                <BarChart3 className="h-7 w-7 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">مؤشرات قراءة</h3>
              <p className="text-muted-foreground leading-relaxed">
                بيانات لحظية ومؤشرات أداء للأسواق والقطاعات مع رسوم بيانية تفاعلية
              </p>
            </div>

            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-premium/30 transition-all duration-300">
              <div className="bg-premium/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-premium/20 transition-colors">
                <Globe className="h-7 w-7 text-premium" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">تغطية إقليمية</h3>
              <p className="text-muted-foreground leading-relaxed">
                تغطية شاملة لأسواق الشرق الأوسط وشمال أفريقيا مع تحديثات مستمرة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-glow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            ابدأ رحلتك الاستثمارية الذكية اليوم
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            انضم إلى مئات المستثمرين وصناع القرار الذين يعتمدون على قراءة
          </p>
          <Button size="xl" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg" asChild>
            <Link to="/auth">
              ابدأ مجاناً الآن
              <ChevronLeft className="h-5 w-5 mr-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
