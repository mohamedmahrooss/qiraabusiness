import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Users, FileText, BarChart3, BookOpen, Shield, Brain,
  Plus, Trash2, Eye, EyeOff, Upload, Loader2,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalReports: number;
  planBreakdown: { plan: string; count: number }[];
}

interface MindDocument {
  id: string;
  title: string;
  content: string;
  source_month: string | null;
  source_year: number | null;
  document_type: string | null;
  is_active: boolean;
  created_at: string;
  file_path?: string | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({ totalUsers: 0, totalArticles: 0, totalReports: 0, planBreakdown: [] });
  const [mindDocs, setMindDocs] = useState<MindDocument[]>([]);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: "", content: "", source_month: "", source_year: "", document_type: "market_signals" });
  const [savingDoc, setSavingDoc] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { navigate("/auth"); return; }
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin");
        if (!roles || roles.length === 0) { navigate("/dashboard"); return; }
        setIsAdmin(true);

        const [articlesRes, reportsRes, profilesRes, docsRes] = await Promise.all([
          supabase.from("articles").select("id", { count: "exact", head: true }),
          supabase.from("reports").select("id", { count: "exact", head: true }),
          supabase.from("profiles").select("subscription_plan"),
          supabase.from("qiraa_mind_documents").select("*").order("created_at", { ascending: false }),
        ]);

        const profiles = profilesRes.data || [];
        const planCounts: Record<string, number> = {};
        profiles.forEach((p) => { const plan = p.subscription_plan || "free"; planCounts[plan] = (planCounts[plan] || 0) + 1; });

        setStats({
          totalUsers: profiles.length,
          totalArticles: articlesRes.count || 0,
          totalReports: reportsRes.count || 0,
          planBreakdown: Object.entries(planCounts).map(([plan, count]) => ({ plan, count })),
        });
        setMindDocs((docsRes.data as MindDocument[]) || []);
      } catch (err) { console.error("Admin dashboard error:", err); }
      finally { setLoading(false); }
    };
    checkAdminAndLoadData();
  }, [navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!newDoc.title.trim()) {
      toast({ title: isRTL ? "خطأ" : "Error", description: isRTL ? "يرجى إدخال العنوان أولاً" : "Please enter a title first", variant: "destructive" });
      return;
    }

    setUploadingFile(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", newDoc.title);
      formData.append("source_month", newDoc.source_month);
      formData.append("source_year", newDoc.source_year);
      formData.append("document_type", newDoc.document_type);

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-document`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const result = await resp.json();
      if (!resp.ok) throw new Error(result.error || "Upload failed");

      setMindDocs(prev => [result.document as MindDocument, ...prev]);
      setNewDoc({ title: "", content: "", source_month: "", source_year: "", document_type: "market_signals" });
      setShowAddDoc(false);
      toast({ title: isRTL ? "تم الرفع" : "Uploaded", description: isRTL ? "تم رفع واستخراج المستند بنجاح" : "Document uploaded and extracted successfully" });
    } catch (err: any) {
      toast({ title: isRTL ? "خطأ" : "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddDocument = async () => {
    if (!newDoc.title.trim() || !newDoc.content.trim()) {
      toast({ title: isRTL ? "خطأ" : "Error", description: isRTL ? "العنوان والمحتوى مطلوبان" : "Title and content are required", variant: "destructive" });
      return;
    }
    setSavingDoc(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.from("qiraa_mind_documents").insert({
        title: newDoc.title, content: newDoc.content,
        source_month: newDoc.source_month || null,
        source_year: newDoc.source_year ? parseInt(newDoc.source_year) : null,
        document_type: newDoc.document_type, uploaded_by: session?.user?.id || null,
      }).select();
      if (error) throw error;
      setMindDocs(prev => [data[0] as MindDocument, ...prev]);
      setNewDoc({ title: "", content: "", source_month: "", source_year: "", document_type: "market_signals" });
      setShowAddDoc(false);
      toast({ title: isRTL ? "تم الإضافة" : "Added", description: isRTL ? "تم إضافة المستند بنجاح" : "Document added successfully" });
    } catch (err: any) {
      toast({ title: isRTL ? "خطأ" : "Error", description: err.message, variant: "destructive" });
    } finally { setSavingDoc(false); }
  };

  const toggleDocActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase.from("qiraa_mind_documents").update({ is_active: !currentActive }).eq("id", id);
    if (!error) setMindDocs(prev => prev.map(d => d.id === id ? { ...d, is_active: !currentActive } : d));
  };

  const deleteDoc = async (id: string) => {
    const { error } = await supabase.from("qiraa_mind_documents").delete().eq("id", id);
    if (!error) { setMindDocs(prev => prev.filter(d => d.id !== id)); toast({ title: isRTL ? "تم الحذف" : "Deleted" }); }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40" />)}</div>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{isRTL ? "لوحة تحكم المشرف" : "Admin Dashboard"}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{isRTL ? "إجمالي المستخدمين" : "Total Users"}</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{stats.totalUsers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{isRTL ? "التحليلات" : "Analytics"}</CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{stats.totalArticles}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{isRTL ? "التقارير" : "Reports"}</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{stats.totalReports}</div></CardContent>
        </Card>
      </div>

      {/* Plan Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />{isRTL ? "توزيع الباقات" : "Plan Distribution"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {stats.planBreakdown.map((item) => (
              <div key={item.plan} className="flex items-center gap-2">
                <Badge variant="secondary">{item.plan}</Badge>
                <span className="text-lg font-semibold">{item.count}</span>
                <span className="text-sm text-muted-foreground">{isRTL ? "مستخدم" : "users"}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QIRAA Mind Management */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {isRTL ? "إدارة عقل قراءة" : "QIRAA Mind Management"}
            </CardTitle>
            <Button size="sm" onClick={() => setShowAddDoc(!showAddDoc)}>
              <Plus className="h-4 w-4 mr-1" />
              {isRTL ? "إضافة مستند" : "Add Document"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isRTL
              ? "النموذج: Google Gemini 3 Flash Preview | البوابة: Lovable AI Gateway | المستندات النشطة تُرسل كسياق للذكاء الاصطناعي"
              : "Model: Google Gemini 3 Flash Preview | Gateway: Lovable AI Gateway | Active documents are sent as AI context"
            }
          </p>
        </CardHeader>
        <CardContent>
          {showAddDoc && (
            <div className="border border-border rounded-lg p-4 mb-6 space-y-4">
              <Input
                placeholder={isRTL ? "عنوان المستند *" : "Document title *"}
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              />
              <div className="grid grid-cols-3 gap-4">
                <Input placeholder={isRTL ? "الشهر" : "Month"} value={newDoc.source_month} onChange={(e) => setNewDoc({ ...newDoc, source_month: e.target.value })} />
                <Input placeholder={isRTL ? "السنة" : "Year"} value={newDoc.source_year} onChange={(e) => setNewDoc({ ...newDoc, source_year: e.target.value })} />
                <select className="border border-border rounded-md px-3 py-2 bg-background text-foreground" value={newDoc.document_type} onChange={(e) => setNewDoc({ ...newDoc, document_type: e.target.value })}>
                  <option value="market_signals">{isRTL ? "تحركات السوق" : "Market Signals"}</option>
                  <option value="founders_guide">{isRTL ? "دليل المؤسس" : "Founder's Guide"}</option>
                  <option value="other">{isRTL ? "أخرى" : "Other"}</option>
                </select>
              </div>

              {/* File Upload Section */}
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 text-primary/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  {isRTL ? "ارفع ملف PDF لاستخراج النص تلقائياً" : "Upload a PDF file for automatic text extraction"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingFile || !newDoc.title.trim()}>
                  {uploadingFile ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{isRTL ? "جاري الرفع..." : "Uploading..."}</> : <><Upload className="h-4 w-4 mr-2" />{isRTL ? "اختر ملف" : "Choose File"}</>}
                </Button>
                {!newDoc.title.trim() && (
                  <p className="text-xs text-destructive mt-2">{isRTL ? "أدخل العنوان أولاً" : "Enter title first"}</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-x-0 top-0 flex items-center justify-center -mt-3">
                  <span className="bg-background px-3 text-xs text-muted-foreground">{isRTL ? "أو أدخل النص يدوياً" : "Or enter text manually"}</span>
                </div>
                <Textarea
                  placeholder={isRTL ? "محتوى المستند..." : "Document content..."}
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                  rows={6}
                  className="mt-4"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddDocument} disabled={savingDoc}>
                  {savingDoc ? "..." : isRTL ? "حفظ النص" : "Save Text"}
                </Button>
                <Button variant="outline" onClick={() => setShowAddDoc(false)}>
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </div>
          )}

          {mindDocs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {isRTL ? "لا توجد مستندات بعد. أضف مستندات لتغذية عقل قراءة." : "No documents yet. Add documents to feed QIRAA Mind."}
            </p>
          ) : (
            <div className="space-y-3">
              {mindDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between border border-border rounded-lg p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium">{doc.title}</h4>
                      <Badge variant={doc.is_active ? "default" : "secondary"}>
                        {doc.is_active ? (isRTL ? "نشط" : "Active") : (isRTL ? "غير نشط" : "Inactive")}
                      </Badge>
                      {doc.document_type && <Badge variant="outline">{doc.document_type}</Badge>}
                      {doc.file_path && <Badge variant="outline" className="text-xs">📎 {isRTL ? "ملف مرفق" : "File attached"}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {doc.source_month} {doc.source_year} • {doc.content.length.toLocaleString()} {isRTL ? "حرف" : "chars"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleDocActive(doc.id, doc.is_active)}>
                      {doc.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteDoc(doc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" className="h-16 gap-3 text-lg" onClick={() => navigate("/articles")}>
          <BookOpen className="h-5 w-5" />{isRTL ? "إدارة المقالات" : "Manage Articles"}
        </Button>
        <Button variant="outline" className="h-16 gap-3 text-lg" onClick={() => navigate("/reports")}>
          <FileText className="h-5 w-5" />{isRTL ? "إدارة التقارير" : "Manage Reports"}
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
