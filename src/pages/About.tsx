import { useLanguage } from "@/hooks/useLanguage";
import { Eye, Target, Heart, Lightbulb, Shield, Users, Globe, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

const About = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: Shield,
      title: language === 'ar' ? 'الشفافية' : 'Transparency',
      description: language === 'ar' 
        ? 'نلتزم بتقديم معلومات وتحليلات واضحة وموثوقة' 
        : 'We commit to providing clear and reliable information and analysis'
    },
    {
      icon: Target,
      title: language === 'ar' ? 'الدقة' : 'Accuracy',
      description: language === 'ar' 
        ? 'نسعى لتوفير رؤى مدعومة بالبيانات ومبنية على منهجيات تحليلية دقيقة' 
        : 'We strive to provide data-driven insights based on precise analytical methodologies'
    },
    {
      icon: Lightbulb,
      title: language === 'ar' ? 'الابتكار' : 'Innovation',
      description: language === 'ar' 
        ? 'نواكب أحدث تقنيات الذكاء الاصطناعي لتحسين فهم الأسواق باستمرار' 
        : 'We keep up with the latest AI technologies to continuously improve market understanding'
    },
    {
      icon: Users,
      title: language === 'ar' ? 'التمكين' : 'Empowerment',
      description: language === 'ar' 
        ? 'نضع بين أيدي المستخدمين أدوات ومعلومات تساعدهم على اتخاذ قرارات واثقة' 
        : 'We provide users with tools and information to help them make confident decisions'
    },
    {
      icon: Globe,
      title: language === 'ar' ? 'التركيز الإقليمي' : 'Regional Focus',
      description: language === 'ar' 
        ? 'نولي اهتمامًا خاصًا بسياق منطقة الشرق الأوسط وشمال أفريقيا ونعكس خصوصية أسواقها' 
        : 'We pay special attention to the MENA region context and reflect the specificity of its markets'
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight whitespace-normal break-words px-2">
          {language === 'ar' ? 'من نحن' : 'About Us'}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          {language === 'ar' 
            ? 'في QIRAA، نمكن الشركات والمستثمرين في منطقة الشرق الأوسط وشمال أفريقيا من اتخاذ قرارات مبنية على البيانات، من خلال تقديم تحليلات دقيقة وشفافة تعتمد على الذكاء الاصطناعي، مع تركيز عميق على خصوصيات وديناميكيات الأسواق الإقليمية.'
            : 'At QIRAA, we leverage cutting-edge AI and data analytics to deliver precise market insights that help businesses and investors make informed decisions across MENA region.'
          }
        </p>
      </div>

      {/* Vision and Mission */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Vision */}
        <Card className="p-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {language === 'ar' 
                ? 'أن نصبح المنصة الرائدة في فهم ديناميكية الأسواق المدعومة بالذكاء الاصطناعي في منطقة الشرق الأوسط وشمال أفريقيا، ونمكّن جيلاً جديدًا من القرارات المستندة إلى البيانات.'
                : 'To become the leading platform for understanding AI-powered market dynamics in the MENA region, enabling a new generation of data-driven decisions.'
              }
            </p>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card className="p-8 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-8 w-8 text-secondary" />
              <h2 className="text-2xl font-bold text-foreground">
                {language === 'ar' ? 'رسالتنا' : 'Our Mission'}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {language === 'ar' 
                ? 'في "قراءة"، نلتزم بتقديم تحليلات سوقية دقيقة وعميقة مدعومة بأحدث تقنيات الذكاء الاصطناعي وتحليل البيانات، بهدف تمكين رواد الأعمال والمستثمرين وصناع القرار في منطقة الشرق الأوسط وشمال أفريقيا من اتخاذ قرارات استراتيجية مبنية على رؤية واضحة وفهم شامل لديناميكيات الأسواق المتغيرة.'
                : 'At QIRAA, we are committed to providing accurate and deep market analysis powered by the latest AI and data analytics technologies, aiming to empower entrepreneurs, investors, and decision-makers in the MENA region to make strategic decisions based on clear vision and comprehensive understanding of changing market dynamics.'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {language === 'ar' ? 'قيمنا' : 'Our Values'}
          </h2>
          <p className="text-muted-foreground text-lg">
            {language === 'ar' 
              ? 'القيم التي توجه عملنا وتحدد هويتنا'
              : 'The values that guide our work and define our identity'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 border-muted/50">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {language === 'ar' ? 'انضم إلى رحلة التحول الرقمي' : 'Join the Digital Transformation Journey'}
          </h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'كن جزءًا من مستقبل التحليل المالي والاستثماري في المنطقة'
              : 'Be part of the future of financial and investment analysis in the region'
            }
          </p>
        </div>
      </div>
      </div>
    </MainLayout>
  );
};

export default About;