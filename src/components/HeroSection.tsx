import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TrendingUp, Brain, Shield, BarChart3, Globe, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const HeroSection = () => {
  const { isRTL } = useLanguage();

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
              <span>{isRTL ? "منصة ذكاء السوق الأولى في المنطقة" : "The Region's Leading Market Intelligence Platform"}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-primary-foreground">
              {isRTL ? "بوابتك الذكية" : "Your Smart Gateway"}
              <br />
              <span className="bg-gradient-to-r from-premium to-premium/70 bg-clip-text text-transparent">
                {isRTL ? "لتحليل الأسواق" : "to Market Analysis"}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/70 leading-relaxed max-w-3xl mx-auto">
              {isRTL
                ? "رؤى وتحليلات والتحليلات اللحظية تساعد صانعي القرار والمستثمرين في منطقة الشرق الأوسط وشمال أفريقيا"
                : "Insights, analytics, and real-time analyses helping decision makers and investors across MENA"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="xl" variant="hero" className="group text-lg" asChild>
                <Link to="/auth">
                  {isRTL ? "ابدأ مجاناً" : "Start Free"}
                  {isRTL
                    ? <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    : <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  }
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            <div className="text-center bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6">
              <div className="text-4xl font-bold text-premium">1200+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">{isRTL ? "تحليل شهري" : "Monthly Analyses"}</div>
            </div>
            <div className="text-center bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6">
              <div className="text-4xl font-bold text-success">20+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">{isRTL ? "قطاع استثماري" : "Investment Sectors"}</div>
            </div>
            <div className="text-center bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6">
              <div className="text-4xl font-bold text-primary-foreground">500+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">{isRTL ? "بيانات شركة ناشئة" : "Startup Data Points"}</div>
            </div>
            <div className="text-center bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6">
              <div className="text-4xl font-bold text-primary-glow">24/7</div>
              <div className="text-sm text-primary-foreground/70 mt-1">{isRTL ? "متابعة مستمرة" : "Continuous Tracking"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isRTL ? "لماذا تختار قراءة؟" : "Why Choose QIRAA?"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isRTL
                ? "أدوات ذكية وتحليلات متقدمة تمنحك ميزة تنافسية في سوق سريع التغير"
                : "Smart tools and advanced analytics giving you a competitive edge in fast-moving markets"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Brain className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{isRTL ? "تقارير استراتيجية" : "Strategic Reports"}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL
                  ? "تحليلات استراتيجية وقطاعية دقيقة تمنحك رؤية شاملة للسوق وفرص الاستثمار"
                  : "Precise strategic and sector analyses giving you a comprehensive market view and investment opportunities"}
              </p>
            </div>

            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-success/30 transition-all duration-300">
              <div className="bg-success/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                <BarChart3 className="h-7 w-7 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{isRTL ? "مؤشرات قراءة" : "QIRAA Signals"}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL
                  ? "بيانات لحظية ومؤشرات أداء للأسواق والقطاعات مع رسوم بيانية تفاعلية"
                  : "Real-time data and performance indicators for markets and sectors with interactive charts"}
              </p>
            </div>

            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-premium/30 transition-all duration-300">
              <div className="bg-premium/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-premium/20 transition-colors">
                <Globe className="h-7 w-7 text-premium" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{isRTL ? "تغطية إقليمية" : "Regional Coverage"}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL
                  ? "تغطية شاملة لأسواق الشرق الأوسط وشمال أفريقيا مع تحديثات مستمرة"
                  : "Comprehensive coverage of MENA markets with continuous updates"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-glow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            {isRTL ? "ابدأ رحلتك الاستثمارية الذكية اليوم" : "Start Your Smart Investment Journey Today"}
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {isRTL
              ? "انضم إلى مئات المستثمرين وصناع القرار الذين يعتمدون على قراءة"
              : "Join hundreds of investors and decision makers who rely on QIRAA"}
          </p>
          <Button size="xl" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg" asChild>
            <Link to="/auth">
              {isRTL ? "ابدأ مجاناً الآن" : "Start Free Now"}
              {isRTL
                ? <ChevronLeft className="h-5 w-5 mr-2" />
                : <ChevronRight className="h-5 w-5 ml-2" />
              }
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
