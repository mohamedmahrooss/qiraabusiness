import { useLanguage } from "@/hooks/useLanguage";

const Reports = () => {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight whitespace-normal break-words px-2">
          {language === 'ar' ? 'التقارير الاستراتيجية' : 'Strategic Reports'}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {language === 'ar' 
            ? 'تقارير تحليلية شاملة ومتعمقة تساعدك في اتخاذ القرارات الاستراتيجية المدروسة'
            : 'Comprehensive and in-depth analytical reports to help you make informed strategic decisions'
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

export default Reports;