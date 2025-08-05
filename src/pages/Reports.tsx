import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Report {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  file_url: string | null;
  category_id: string | null;
  created_at: string;
  cover_image: string | null;
  required_plan: string;
  price: number;
  download_count: number;
  categories: {
    id: string;
    name_ar: string;
    name_en: string;
  } | null;
}

const Reports = () => {
  const { language } = useLanguage();

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id,
          title_ar,
          title_en,
          description_ar,
          description_en,
          file_url,
          category_id,
          created_at,
          cover_image,
          required_plan,
          price,
          download_count,
          categories (
            id,
            name_ar,
            name_en
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Report[];
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy', { 
      locale: language === 'ar' ? ar : undefined 
    });
  };

  if (isLoading) {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight whitespace-normal break-words px-2">
            {language === 'ar' ? 'التقارير الاستراتيجية' : 'Strategic Reports'}
          </h1>
        </div>
        
        <div className="text-center py-20">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <div className="text-muted-foreground text-lg mb-2">
            {language === 'ar' ? 'حدث خطأ في تحميل التقارير' : 'Error loading reports'}
          </div>
          <div className="text-sm text-muted-foreground">
            {language === 'ar' ? 'يرجى المحاولة مرة أخرى لاحقاً' : 'Please try again later'}
          </div>
        </div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
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
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <div className="text-muted-foreground text-lg">
            {language === 'ar' ? 'لا توجد تقارير متاحة حالياً' : 'No reports available at the moment'}
          </div>
        </div>
      </div>
    );
  }

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            {report.cover_image && (
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img 
                  src={report.cover_image} 
                  alt={language === 'ar' ? report.title_ar : report.title_en}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <CardHeader className="flex-grow">
              <div className="flex justify-between items-start gap-2 mb-2">
                {report.categories && (
                  <Badge variant="secondary" className="shrink-0">
                    {language === 'ar' ? report.categories.name_ar : report.categories.name_en}
                  </Badge>
                )}
                <div className={`flex items-center text-xs text-muted-foreground ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Calendar className={`h-3 w-3 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                  {formatDate(report.created_at)}
                </div>
              </div>
              
              <CardTitle className="line-clamp-2 leading-tight">
                {language === 'ar' ? report.title_ar : report.title_en}
              </CardTitle>
              
              {(report.description_ar || report.description_en) && (
                <CardDescription className="line-clamp-3 leading-relaxed">
                  {language === 'ar' ? report.description_ar : report.description_en}
                </CardDescription>
              )}
              
              <div className={`flex items-center justify-between text-sm text-muted-foreground pt-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span>
                  {language === 'ar' ? `${report.download_count} تحميل` : `${report.download_count} downloads`}
                </span>
                {report.price > 0 && (
                  <span className="font-semibold">
                    ${report.price}
                  </span>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button 
                className="w-full" 
                onClick={() => report.file_url && window.open(report.file_url, '_blank')}
                disabled={!report.file_url}
              >
                <ExternalLink className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {language === 'ar' ? 'عرض التقرير' : 'View Report'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;