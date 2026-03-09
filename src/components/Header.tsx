import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/hooks/useLanguage";
import { Menu, X, LogIn, LogOut, LayoutDashboard, Shield, ChevronDown } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signalsOpen, setSignalsOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin");
        setIsAdmin(!!(roles && roles.length > 0));
      }
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSignalsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-5 z-50 w-[calc(100%-4rem)] max-w-7xl mx-auto rounded-xl border border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/images/qiraa-logo.png" alt="QIRAA" className="h-28 object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              {isRTL ? 'الرئيسية' : 'Home'}
            </Link>
            <Link to="/articles" className="text-foreground hover:text-primary transition-colors">
              {isRTL ? 'تحليلات' : 'Analytics'}
            </Link>
            <Link to="/reports" className="text-foreground hover:text-primary transition-colors">
              {isRTL ? 'التقارير' : 'Reports'}
            </Link>

            {/* QIRAA Signals Dropdown - no icons */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); setSignalsOpen(true); }}
              onMouseLeave={() => { closeTimerRef.current = setTimeout(() => setSignalsOpen(false), 250); }}
            >
              <button
                onClick={() => setSignalsOpen(!signalsOpen)}
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
              >
                {isRTL ? 'مؤشرات قراءة' : 'QIRAA Signals'}
                <ChevronDown className={`h-4 w-4 transition-transform ${signalsOpen ? 'rotate-180' : ''}`} />
              </button>

              {signalsOpen && (
                <div className={`absolute top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl py-2 z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
                  <Link
                    to="/qiraa-signals"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                    onClick={() => setSignalsOpen(false)}
                  >
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {isRTL ? 'مؤشرات المبيعات' : 'Sales Intelligence'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isRTL ? 'لوحة البيانات والرسوم البيانية' : 'Dashboard & Charts'}
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/qiraa-mind"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                    onClick={() => setSignalsOpen(false)}
                  >
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {isRTL ? 'عقل قراءة' : 'QIRAA Mind'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isRTL ? 'المحلل الاستراتيجي الذكي' : 'AI Strategic Analyst'}
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
              {isRTL ? 'الباقات' : 'Pricing'}
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              {isRTL ? 'من نحن' : 'About'}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <LanguageToggle />
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin">
                      <Shield className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {isRTL ? 'لوحة المشرف' : 'Admin'}
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">
                    <LogIn className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                  </Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/auth">{isRTL ? 'ابدأ مجاناً' : 'Start Free'}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                {isRTL ? 'الرئيسية' : 'Home'}
              </Link>
              <Link to="/articles" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                {isRTL ? 'تحليلات' : 'Analytics'}
              </Link>
              <Link to="/reports" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                {isRTL ? 'التقارير' : 'Reports'}
              </Link>
              
              {/* Mobile QIRAA Signals submenu - no icons */}
              <div className="space-y-2">
                <span className="text-foreground font-medium">{isRTL ? 'مؤشرات قراءة' : 'QIRAA Signals'}</span>
                <div className={`${isRTL ? 'pr-4' : 'pl-4'} space-y-2`}>
                  <Link to="/qiraa-signals" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                    {isRTL ? 'مؤشرات المبيعات' : 'Sales Intelligence'}
                  </Link>
                  <Link to="/qiraa-mind" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                    {isRTL ? 'عقل قراءة' : 'QIRAA Mind'}
                  </Link>
                </div>
              </div>

              <Link to="/pricing" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                {isRTL ? 'الباقات' : 'Pricing'}
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                {isRTL ? 'من نحن' : 'About'}
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                        <LogIn className="h-4 w-4 mr-2" />
                        {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                      </Link>
                    </Button>
                    <Button variant="hero" size="sm" asChild>
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>{isRTL ? 'ابدأ مجاناً' : 'Start Free'}</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
