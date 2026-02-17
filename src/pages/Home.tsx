import HeroSection from "@/components/HeroSection";
import { TrendingUp, FileText, Users, Globe, ArrowLeft, BarChart3, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const Home = () => {
  const { isRTL } = useLanguage();

  return (
    <>
      <HeroSection />

      {/* Market Intelligence Showcase Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isRTL ? "رؤية شاملة لأسواق المنطقة" : "Complete View of Regional Markets"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {isRTL 
                ? "نوفر لك بيانات دقيقة وتحليلات استراتيجية تغطي أهم القطاعات الاستثمارية في الشرق الأوسط وشمال أفريقيا"
                : "We provide accurate data and strategic analysis covering the most important investment sectors in MENA"
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {isRTL ? "تحركات السوق الشهرية" : "Monthly Market Signals"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? "تقارير شهرية تفصيلية عن أبرز الصفقات والاستثمارات والشراكات في المنطقة مع تحليل استراتيجي لكل تحرك"
                  : "Detailed monthly reports on top deals, investments, and partnerships in the region with strategic analysis"
                }
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-success/30 transition-all duration-300">
              <div className="bg-success/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                <TrendingUp className="h-7 w-7 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {isRTL ? "مؤشرات الأداء القطاعي" : "Sector Performance Indicators"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? "بيانات لحظية عن إيرادات ومبيعات القطاعات مع مقارنات شهرية وسنوية ورسوم بيانية تفاعلية"
                  : "Real-time sector revenue and sales data with monthly/annual comparisons and interactive charts"
                }
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-premium/30 transition-all duration-300">
              <div className="bg-premium/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-premium/20 transition-colors">
                <FileText className="h-7 w-7 text-premium" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {isRTL ? "دليل المؤسس والمستثمر" : "Founder & Investor Guide"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? "تحليلات استراتيجية متعمقة لكل صفقة مع خطوات عملية لرواد الأعمال وإشارات استثمارية واضحة"
                  : "Deep strategic analysis of each deal with actionable steps for founders and clear investment signals"
                }
              </p>
            </div>

            {/* Card 4 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {isRTL ? "تغطية إقليمية واسعة" : "Broad Regional Coverage"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? "مصر، السعودية، الإمارات، البحرين، المغرب، تونس، الجزائر وأكثر - تغطية شاملة لكل سوق"
                  : "Egypt, KSA, UAE, Bahrain, Morocco, Tunisia, Algeria and more - comprehensive coverage"
                }
              </p>
            </div>

            {/* Card 5 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-success/30 transition-all duration-300">
              <div className="bg-success/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                <Users className="h-7 w-7 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {isRTL ? "عقل قراءة - مساعد ذكي" : "QIRAA Mind - AI Assistant"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? "محلل استراتيجي مدعوم بالذكاء الاصطناعي يجيب على أسئلتك حول تحركات السوق والفرص الاستثمارية"
                  : "AI-powered strategic analyst answering your questions about market movements and investment opportunities"
                }
              </p>
            </div>

            {/* Card 6 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-premium/30 transition-all duration-300">
              <div className="bg-premium/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-premium/20 transition-colors">
                <Shield className="h-7 w-7 text-premium" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {isRTL ? "بيانات موثوقة ودقيقة" : "Reliable & Accurate Data"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? "جميع البيانات مصدرها مصادر موثوقة ومعتمدة مع تحديث مستمر لضمان دقة المعلومات"
                  : "All data sourced from verified and accredited sources with continuous updates for accuracy"
                }
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="xl" variant="default" className="text-lg" asChild>
              <Link to="/auth">
                {isRTL ? "ابدأ رحلتك الاستثمارية" : "Start Your Investment Journey"}
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
