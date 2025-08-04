import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Calendar, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: string;
  title_ar: string;
  title_en: string;
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

interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
}

const ARTICLES_PER_PAGE = 6;

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { language, isRTL } = useLanguage();
  const t = useTranslation();
  const { toast } = useToast();

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = searchParams.get('page');
    
    if (category) setSelectedCategory(category);
    if (search) setSearchTerm(search);
    if (page) setCurrentPage(parseInt(page) || 1);
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name_ar');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: language === 'ar' ? 'خطأ في جلب التصنيفات' : 'Error fetching categories',
          description: language === 'ar' 
            ? 'حدث خطأ أثناء جلب التصنيفات' 
            : 'An error occurred while fetching categories',
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, [language, toast]);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      
      try {
        let query = supabase
          .from('articles')
          .select(`
            *,
            categories(id, name_ar, name_en, slug)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        // Apply category filter
        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }

        // Apply search filter
        if (searchTerm.trim()) {
          const searchColumn = language === 'ar' ? 'title_ar' : 'title_en';
          query = query.ilike(searchColumn, `%${searchTerm.trim()}%`);
        }

        // Get total count for pagination
        const { count } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');
        setTotalArticles(count || 0);

        // Apply pagination
        const from = (currentPage - 1) * ARTICLES_PER_PAGE;
        const to = from + ARTICLES_PER_PAGE - 1;
        
        const { data, error } = await query.range(from, to);
        
        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
        toast({
          title: language === 'ar' ? 'خطأ في جلب المقالات' : 'Error fetching articles',
          description: language === 'ar' 
            ? 'حدث خطأ أثناء جلب المقالات' 
            : 'An error occurred while fetching articles',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory, searchTerm, currentPage, language, toast]);

  // Update URL params
  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset page when filtering
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateSearchParams('search', value || null);
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    updateSearchParams('category', categoryId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  const handleArticleClick = async (articleId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Record article view
        await supabase
          .from('user_articles')
          .insert({
            user_id: user.id,
            article_id: articleId
          });
      }
    } catch (error) {
      console.error('Error recording article view:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
            {language === 'ar' ? 'المقالات' : 'Articles'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'اكتشف آخر التحليلات والمقالات في عالم الأعمال والاستثمار' 
              : 'Discover the latest analysis and articles in business and investment'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={language === 'ar' ? 'البحث في المقالات...' : 'Search articles...'}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter(null)}
            >
              {language === 'ar' ? 'جميع التصنيفات' : 'All Categories'}
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category.id)}
              >
                {language === 'ar' ? category.name_ar : category.name_en}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {language === 'ar' ? 'لم يتم العثور على مقالات' : 'No articles found'}
            </div>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory(null);
              setSearchParams({});
              setCurrentPage(1);
            }}>
              {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <Link 
                    to={`/articles/${article.id}`}
                    onClick={() => handleArticleClick(article.id)}
                  >
                    {article.featured_image && (
                      <div className="overflow-hidden">
                        <img
                          src={article.featured_image}
                          alt={language === 'ar' ? article.title_ar : article.title_en}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {article.categories && (
                          <Badge variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {language === 'ar' ? article.categories.name_ar : article.categories.name_en}
                          </Badge>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(article.published_at)}
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {language === 'ar' ? article.title_ar : article.title_en}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {language === 'ar' ? article.excerpt_ar : article.excerpt_en}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (page === currentPage || 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
  );
};

export default Articles;