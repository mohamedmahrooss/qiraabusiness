import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, User, LogIn } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <a href="#home" className="text-foreground hover:text-primary transition-colors">
              الرئيسية
            </a>
            <a href="#briefs" className="text-foreground hover:text-primary transition-colors">
              التحليلات اليومية
            </a>
            <a href="#reports" className="text-foreground hover:text-primary transition-colors">
              التقارير الاستراتيجية
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
              الباقات
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              من نحن
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              العربية
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">
                <LogIn className="h-4 w-4 mr-2" />
                تسجيل الدخول
              </Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/auth">ابدأ مجاناً</Link>
            </Button>
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
              <a href="#home" className="text-foreground hover:text-primary transition-colors">
                الرئيسية
              </a>
              <a href="#briefs" className="text-foreground hover:text-primary transition-colors">
                التحليلات اليومية
              </a>
              <a href="#reports" className="text-foreground hover:text-primary transition-colors">
                التقارير الاستراتيجية
              </a>
              <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
                الباقات
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                من نحن
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-2" />
                    تسجيل الدخول
                  </Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/auth">ابدأ مجاناً</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;