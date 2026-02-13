import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Calendar, Download, ExternalLink, FileText } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === "ar";

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select(`*, categories (id, name_ar, name_en)`)
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy", {
      locale: language === "ar" ? ar : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-96 w-full mb-8 rounded-xl" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">
          {isRTL ? "لم يتم العثور على التقرير" : "Report not found"}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/reports")}>
          {isRTL ? "العودة للتقارير" : "Back to Reports"}
        </Button>
      </div>
    );
  }

  const title = isRTL ? report.title_ar : report.title_en;
  const description = isRTL ? report.description_ar : report.description_en;
  const categoryName = report.categories
    ? isRTL
      ? (report.categories as any).name_ar
      : (report.categories as any).name_en
    : null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate("/reports")}
      >
        {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
        {isRTL ? "العودة للتقارير" : "Back to Reports"}
      </Button>

      {/* Cover Image */}
      {report.cover_image && (
        <div className="rounded-xl overflow-hidden shadow-lg mb-8">
          <img
            src={report.cover_image}
            alt={title}
            className="w-full h-auto max-h-[500px] object-contain bg-muted"
          />
        </div>
      )}

      {/* Title & Meta */}
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>

        <div className="flex flex-wrap items-center gap-3">
          {categoryName && <Badge variant="secondary">{categoryName}</Badge>}
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(report.created_at)}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Download className="h-3 w-3" />
            {report.download_count} {isRTL ? "تحميل" : "downloads"}
          </Badge>
          {report.price > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              ${report.price}
            </Badge>
          )}
          <Badge variant="secondary">
            {isRTL ? `باقة ${report.required_plan}` : `${report.required_plan} plan`}
          </Badge>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      )}

      {/* Action Button */}
      <Button
        size="lg"
        className="w-full sm:w-auto gap-2"
        onClick={() => report.file_url && window.open(report.file_url, "_blank")}
        disabled={!report.file_url}
      >
        <ExternalLink className="h-5 w-5" />
        {isRTL ? "عرض التقرير" : "View Report"}
      </Button>
    </div>
  );
};

export default ReportDetails;
