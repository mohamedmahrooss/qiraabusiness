import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Analytic {
  id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  featured_image: string | null;
  published_at: string;
  category_id: string | null;
  categories?: {
    id: string;
    name_ar: string;
    name_en: string;
    slug: string;
  };
}

const ArticleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const translations = useTranslation();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [limitReached, setLimitReached] = useState(false);

  const PLAN_LIMITS: Record<string, { daily: number; monthly: number }> = {
    free: { daily: 3, monthly: 20 },
    basic: { daily: 10, monthly: 50 },
    pro: { daily: -1, monthly: -1 },
    enterprise: { daily: -1, monthly: -1 },
  };

  useEffect(() => {
    console.log('ArticleDetails mounted with id:', id);
    const fetchArticle = async () => {
      if (!id) {
        console.log('No ID found in params');
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Check user limits first
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_plan, daily_articles_read, monthly_articles_read')
            .eq('user_id', user.id)
            .single();

          if (profile) {
            const limits = PLAN_LIMITS[profile.subscription_plan] || PLAN_LIMITS.free;
            // Check if admin (admins bypass limits)
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', user.id)
              .eq('role', 'admin');
            
            const isAdmin = roles && roles.length > 0;

            if (!isAdmin && limits.daily > 0 && profile.daily_articles_read >= limits.daily) {
              setLimitReached(true);
              setLoading(false);
              return;
            }
            if (!isAdmin && limits.monthly > 0 && profile.monthly_articles_read >= limits.monthly) {
              setLimitReached(true);
              setLoading(false);
              return;
            }
          }
        }

        const { data, error } = await supabase
          .from('articles')
          .select(`
            *,
            categories (
              id,
              name_ar,
              name_en,
              slug
            )
          `)
          .eq('id', id)
          .eq('status', 'published')
          .maybeSingle();

        if (error) {
          console.error('Error fetching article:', error);
          toast({
            title: language === 'ar' ? 'خطأ في تحميل المقال' : 'Error loading article',
            description: language === 'ar' ? 'حدث خطأ أثناء تحميل المقال' : 'An error occurred while loading the article',
            variant: "destructive",
          });
          setNotFound(true);
        } else if (!data) {
          setNotFound(true);
        } else {
          setArticle(data);
          
          // Track article view and increment counters
          if (user) {
            await supabase
              .from('user_articles')
              .insert([{ user_id: user.id, article_id: data.id }]);

            // Increment read counters
            const { data: currentProfile } = await supabase
              .from('profiles')
              .select('daily_articles_read, monthly_articles_read')
              .eq('user_id', user.id)
              .single();

            if (currentProfile) {
              await supabase
                .from('profiles')
                .update({
                  daily_articles_read: currentProfile.daily_articles_read + 1,
                  monthly_articles_read: currentProfile.monthly_articles_read + 1,
                })
                .eq('user_id', user.id);
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, toast, language]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatContent = (content: string) => {
    if (!content) return [];
    
    // Split content by new lines and filter out empty strings
    const paragraphs = content.split('\n').filter(paragraph => paragraph.trim() !== '');
    
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph.trim()}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-full mb-4" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-64 w-full mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (limitReached) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-10">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            {language === 'ar' ? 'لقد وصلت إلى حد الاستخدام الشهري' : 'You have reached your monthly usage limit'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'ar' ? 'يرجى ترقية باقتك للاستمرار في قراءة التحليلات' : 'Please upgrade your plan to continue reading analyses'}
          </p>
          <Button onClick={() => navigate('/pricing')}>
            {language === 'ar' ? 'ترقية الباقة' : 'Upgrade Plan'}
          </Button>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">
            {language === 'ar' ? 'المقال غير موجود' : 'Article not found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'ar' ? 'عذراً، لم نتمكن من العثور على المقال المطلوب' : 'Sorry, we could not find the requested article'}
          </p>
          <Button onClick={() => navigate('/articles')} variant="outline">
            <ArrowLeft className="w-4 h-4 mx-2" />
            {language === 'ar' ? 'العودة إلى المقالات' : 'Back to Articles'}
          </Button>
        </div>
      </div>
    );
  }

  const title = language === 'ar' ? article.title_ar : article.title_en;
  const content = language === 'ar' ? article.content_ar : article.content_en;
  const categoryName = article.categories 
    ? (language === 'ar' ? article.categories.name_ar : article.categories.name_en)
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button 
        onClick={() => navigate('/articles')} 
        variant="ghost" 
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mx-2" />
        {language === 'ar' ? 'العودة إلى المقالات' : 'Back to Articles'}
      </Button>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
          {title}
        </h1>
        
        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {formatDate(article.published_at)}
            </span>
          </div>
          
          {categoryName && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <Badge variant="secondary">
                {categoryName}
              </Badge>
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="mb-8">
          <img
            src={article.featured_image}
            alt={title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="prose prose-lg max-w-none dark:prose-invert">
        <div 
          className={`
            ${isRTL ? 'text-right' : 'text-left'}
            leading-relaxed text-foreground
            prose-headings:text-foreground 
            prose-p:text-foreground
            prose-strong:text-foreground
            prose-em:text-foreground
            prose-blockquote:text-muted-foreground
            prose-blockquote:border-l-primary
            prose-code:text-primary
            prose-pre:bg-muted
            prose-pre:text-foreground
            prose-a:text-primary
            prose-a:no-underline
            hover:prose-a:underline
          `}
        >
          {formatContent(content)}
        </div>
      </article>

      {/* Navigation Footer */}
      <footer className="mt-12 pt-8 border-t border-border">
        <Button 
          onClick={() => navigate('/articles')} 
          variant="outline"
          className="w-full md:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mx-2" />
          {language === 'ar' ? 'العودة إلى المقالات' : 'Back to Articles'}
        </Button>
      </footer>
    </div>
  );
};

export default ArticleDetails;