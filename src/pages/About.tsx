import { useLanguage } from "@/hooks/useLanguage";

const About = () => {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
          {language === 'ar' ? 'من نحن' : 'About Us'}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {language === 'ar' 
            ? 'نحن منصة متخصصة في تحليل الأسواق والاستثمارات باستخدام تقنيات الذكاء الاصطناعي'
            : 'We are a specialized platform for market and investment analysis using artificial intelligence technologies'
          }
        </p>
      </div>
      
      <div className="text-center py-20">
        <div className="text-muted-foreground text-lg">
          {language === 'ar' ? 'قريباً...' : 'Coming Soon...'}
        </div>
      </div>
    </div>
  );
};

export default About;