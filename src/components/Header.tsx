import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/hooks/useLanguage";
import { Menu, X, User, LogIn, LogOut, LayoutDashboard } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              QIRAA
            </div>
            <div className="hidden md:block ml-2 text-sm text-muted-foreground">
              AI Market Intelligence
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              {isRTL ? 'الرئيسية' : 'Home'}
            </Link>
            <Link to="/articles" className="text-foreground hover:text-primary transition-colors">
              {isRTL ? 'المقالات' : 'Articles'}
            </Link>
            <Link to="/reports" className="text-foreground hover:text-primary transition-colors">
              {isRTL ? 'التقارير' : 'Reports'}
            </Link>
            <Link to="/#pricing" className="text-foreground hover:text-primary transition-colors">
              {isRTL ? 'الباقات' : 'Pricing'}
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              {isRTL ? 'من نحن' : 'About'}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-2" />
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
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                {isRTL ? 'الرئيسية' : 'Home'}
              </Link>
              <Link to="/articles" className="text-foreground hover:text-primary transition-colors">
                {isRTL ? 'المقالات' : 'Articles'}
              </Link>
              <Link to="/reports" className="text-foreground hover:text-primary transition-colors">
                {isRTL ? 'التقارير' : 'Reports'}
              </Link>
              <Link to="/#pricing" className="text-foreground hover:text-primary transition-colors">
                {isRTL ? 'الباقات' : 'Pricing'}
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                {isRTL ? 'من نحن' : 'About'}
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link to="/dashboard">
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
                      <Link to="/auth">
                        <LogIn className="h-4 w-4 mr-2" />
                        {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                      </Link>
                    </Button>
                    <Button variant="hero" size="sm" asChild>
                      <Link to="/auth">{isRTL ? 'ابدأ مجاناً' : 'Start Free'}</Link>
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