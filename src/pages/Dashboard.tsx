import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  BookOpen, 
  FileText, 
  Crown, 
  BarChart3, 
  TrendingUp,
  AlertCircle,
  User as UserIcon,
  LineChart,
  Zap
} from "lucide-react";

interface UserProfile {
  full_name: string;
  subscription_plan: 'free' | 'basic' | 'pro' | 'enterprise';
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  daily_articles_read: number;
  monthly_articles_read: number;
  qiraa_mind_tokens: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const t = useTranslation();
  const { toast } = useToast();

  // Get subscription plan details
  const getSubscriptionDetails = (plan: string) => {
    const limits = {
      free: { daily: 3, monthly: 20 },
      basic: { daily: 10, monthly: 50 },
      pro: { daily: -1, monthly: -1 },
      enterprise: { daily: -1, monthly: -1 }
    };
    
    const planNames = {
      free: isRTL ? 'مجاني' : 'Free',
      basic: isRTL ? 'أساسي' : 'Basic',
      pro: isRTL ? 'احترافي' : 'Pro',
      enterprise: isRTL ? 'مؤسسي' : 'Enterprise'
    };

    return {
      name: planNames[plan as keyof typeof planNames] || planNames.free,
      limits: limits[plan as keyof typeof limits] || limits.free,
      color: plan === 'free' ? 'secondary' : plan === 'basic' ? 'primary' : plan === 'pro' ? 'success' : 'premium'
    };
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return isRTL ? 'غير محدد' : 'Not set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate('/auth');
          return;
        }

        setUser(session.user);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // No profile found, redirect to complete registration
            navigate('/auth');
            return;
          }
          throw profileError;
        }

        setProfile(profileData);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError(isRTL ? 'حدث خطأ في تحميل البيانات' : 'Error loading data');
        toast({
          title: isRTL ? "خطأ" : "Error",
          description: isRTL ? "فشل في تحميل بيانات المستخدم" : "Failed to load user data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isRTL, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">
              {isRTL ? 'خطأ في التحميل' : 'Loading Error'}
            </CardTitle>
            <CardDescription>
              {error || (isRTL ? 'لم يتم العثور على بيانات المستخدم' : 'User data not found')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/auth')} variant="outline">
              {isRTL ? 'العودة للتسجيل' : 'Back to Auth'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subscriptionDetails = getSubscriptionDetails(profile.subscription_plan);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <UserIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            {isRTL ? `مرحباً، ${profile.full_name}` : `Welcome, ${profile.full_name}`}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isRTL ? 'نظرة عامة على نشاطك في منصة قراء' : 'Overview of your activity on QIRAA platform'}
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Subscription Plan Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-premium" />
                {isRTL ? 'باقة الاشتراك' : 'Subscription Plan'}
              </CardTitle>
              <Badge 
                variant="secondary" 
                className={`bg-${subscriptionDetails.color} text-${subscriptionDetails.color}-foreground`}
              >
                {subscriptionDetails.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'تاريخ البدء' : 'Start Date'}
                </p>
                <p className="font-medium">
                  {formatDate(profile.subscription_start_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'تاريخ الانتهاء' : 'End Date'}
                </p>
                <p className="font-medium">
                  {formatDate(profile.subscription_end_date)}
                </p>
              </div>
            </div>
            
            {profile.subscription_plan === 'free' && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  {isRTL ? 'ترقي باقتك للحصول على مزيد من المحتوى والميزات' : 'Upgrade your plan for more content and features'}
                </p>
                <Button size="sm" className="w-full">
                  {isRTL ? 'ترقية الباقة' : 'Upgrade Plan'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Balance Card */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" />
              {isRTL ? 'رصيد QIRAA Mind' : 'QIRAA Mind Balance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold text-foreground font-mono">{profile.qiraa_mind_tokens || 0}</span>
              <span className="text-muted-foreground text-sm mb-1">{isRTL ? 'سؤال متبقي' : 'queries remaining'}</span>
            </div>
            <Progress value={Math.min(((profile.qiraa_mind_tokens || 0) / Math.max(profile.qiraa_mind_tokens || 0, 50)) * 100, 100)} className="h-2.5 mb-2" />
            <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => navigate('/pricing')}>
              {isRTL ? 'شراء توكنز إضافية' : 'Buy More Tokens'}
            </Button>
          </CardContent>
        </Card>

        {/* Reading Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-success" />
              {isRTL ? 'إحصائيات القراءة' : 'Reading Stats'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'اليوم' : 'Today'}
                </span>
                <span className="text-sm font-medium">
                  {profile.daily_articles_read}
                  {subscriptionDetails.limits.daily > 0 && ` / ${subscriptionDetails.limits.daily}`}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: subscriptionDetails.limits.daily > 0 
                      ? `${Math.min((profile.daily_articles_read / subscriptionDetails.limits.daily) * 100, 100)}%`
                      : '100%'
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'هذا الشهر' : 'This Month'}
                </span>
                <span className="text-sm font-medium">
                  {profile.monthly_articles_read}
                  {subscriptionDetails.limits.monthly > 0 && ` / ${subscriptionDetails.limits.monthly}`}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: subscriptionDetails.limits.monthly > 0 
                      ? `${Math.min((profile.monthly_articles_read / subscriptionDetails.limits.monthly) * 100, 100)}%`
                      : '100%'
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {isRTL ? 'التحليلات' : 'Analytics'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'اكتشف المحتوى التحليلي الحصري' : 'Discover exclusive analytical content'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate('/articles')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {isRTL ? 'تصفح التحليلات' : 'Browse Analytics'}
            </Button>
          </CardContent>
        </Card>

        {/* Reports Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-secondary" />
              {isRTL ? 'التقارير' : 'Reports'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'تقارير متخصصة قابلة للتحميل' : 'Specialized downloadable reports'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => navigate('/reports')}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isRTL ? 'تصفح التقارير' : 'Browse Reports'}
            </Button>
          </CardContent>
        </Card>

        {/* QIRAA Signals Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              {isRTL ? 'مؤشرات قراءة' : 'QIRAA Signals'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'بيانات مبيعات حصرية لاتخاذ قرارات أذكى' : 'Exclusive sales data for smarter decisions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/qiraa-signals')}
            >
              <LineChart className="h-4 w-4 mr-2" />
              {isRTL ? 'استكشاف المؤشرات' : 'Explore Signals'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => navigate('/analytics')}>
            <BookOpen className="h-4 w-4 mr-2" />
            {isRTL ? 'قراءة جديدة' : 'New Reading'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/reports')}>
            <FileText className="h-4 w-4 mr-2" />
            {isRTL ? 'تحميل تقرير' : 'Download Report'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/qiraa-signals')}>
            <LineChart className="h-4 w-4 mr-2" />
            {isRTL ? 'مؤشرات قراءة' : 'QIRAA Signals'}
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            {isRTL ? 'جدولة قراءة' : 'Schedule Reading'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;