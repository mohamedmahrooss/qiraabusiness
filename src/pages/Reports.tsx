import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();
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
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map((report) => (
          <div
            key={report.id}
            className="group cursor-pointer rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300"
            onClick={() => navigate(`/reports/${report.id}`)}
          >
            {/* Cover Image - Full Display */}
            <div className="relative overflow-hidden bg-muted">
              {report.cover_image ? (
                <img
                  src={report.cover_image}
                  alt={language === 'ar' ? report.title_ar : report.title_en}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              {report.categories && (
                <Badge variant="secondary" className="absolute top-3 left-3">
                  {language === 'ar' ? report.categories.name_ar : report.categories.name_en}
                </Badge>
              )}
            </div>

            {/* Report Name */}
            <div className="p-5 space-y-3">
              <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {language === 'ar' ? report.title_ar : report.title_en}
              </h3>

              <Button
                className="w-full gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/reports/${report.id}`);
                }}
              >
                <ExternalLink className="h-4 w-4" />
                {language === 'ar' ? 'عرض التقرير' : 'View Report'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;