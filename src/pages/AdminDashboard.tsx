import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileText,
  BarChart3,
  BookOpen,
  Shield,
  Settings,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalReports: number;
  planBreakdown: { plan: string; count: number }[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalArticles: 0,
    totalReports: 0,
    planBreakdown: [],
  });

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate("/auth");
          return;
        }

        // Check admin role
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin");

        if (!roles || roles.length === 0) {
          navigate("/dashboard");
          return;
        }

        setIsAdmin(true);

        // Load stats
        const [articlesRes, reportsRes, profilesRes] = await Promise.all([
          supabase.from("articles").select("id", { count: "exact", head: true }),
          supabase.from("reports").select("id", { count: "exact", head: true }),
          supabase.from("profiles").select("subscription_plan"),
        ]);

        const profiles = profilesRes.data || [];
        const planCounts: Record<string, number> = {};
        profiles.forEach((p) => {
          const plan = p.subscription_plan || "free";
          planCounts[plan] = (planCounts[plan] || 0) + 1;
        });

        setStats({
          totalUsers: profiles.length,
          totalArticles: articlesRes.count || 0,
          totalReports: reportsRes.count || 0,
          planBreakdown: Object.entries(planCounts).map(([plan, count]) => ({
            plan,
            count,
          })),
        });
      } catch (err) {
        console.error("Admin dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">
          {isRTL ? "لوحة تحكم المشرف" : "Admin Dashboard"}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isRTL ? "إجمالي المستخدمين" : "Total Users"}
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isRTL ? "المقالات" : "Articles"}
            </CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalArticles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isRTL ? "التقارير" : "Reports"}
            </CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReports}</div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {isRTL ? "توزيع الباقات" : "Plan Distribution"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {stats.planBreakdown.map((item) => (
              <div key={item.plan} className="flex items-center gap-2">
                <Badge variant="secondary">{item.plan}</Badge>
                <span className="text-lg font-semibold">{item.count}</span>
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "مستخدم" : "users"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-16 gap-3 text-lg"
          onClick={() => navigate("/articles")}
        >
          <BookOpen className="h-5 w-5" />
          {isRTL ? "إدارة المقالات" : "Manage Articles"}
        </Button>
        <Button
          variant="outline"
          className="h-16 gap-3 text-lg"
          onClick={() => navigate("/reports")}
        >
          <FileText className="h-5 w-5" />
          {isRTL ? "إدارة التقارير" : "Manage Reports"}
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
