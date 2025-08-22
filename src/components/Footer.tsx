import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
const Footer = () => {
  return <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              QIRAA
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed">منصة ذكاء سوقي لفهم ديناميكيات الأسواق في منطقة الشرق الاوسط و شمال افريقيا . من خلال رؤى و تحليلات و تقارير دقية , ستساعد قراءة صانعي القرار و المستثمرين على رؤية الصورة الكاملة و اتخاذ قرارات أكثر استنارة و ثقة .</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#briefs" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  التحليلات اليومية
                </a>
              </li>
              <li>
                <a href="#reports" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  التقارير الاستراتيجية
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  الباقات والأسعار
                </a>
              </li>
              <li>
                <a href="#about" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  من نحن
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الدعم والمساعدة</h3>
            <ul className="space-y-3">
              <li>
                <a href="#help" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  مركز المساعدة
                </a>
              </li>
              <li>
                <a href="#contact" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  تواصل معنا
                </a>
              </li>
              <li>
                <a href="#api" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  واجهة API
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#terms" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  شروط الاستخدام
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">اشترك في النشرة</h3>
            <p className="text-secondary-foreground/80 text-sm">
              احصل على آخر التحليلات والتحديثات مباشرة في بريدك الإلكتروني
            </p>
            <div className="flex space-x-2">
              <Input placeholder="بريدك الإلكتروني" className="bg-background/10 border-secondary-foreground/20" />
              <Button variant="default" size="sm">
                اشتراك
              </Button>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">info@qiraabusiness.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+966 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-secondary-foreground/60">© 2025 QIRAA. جميع الحقوق محفوظة.</div>
            <div className="flex space-x-6 rtl:space-x-reverse">
              <a href="#privacy" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#terms" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                شروط الاستخدام
              </a>
              <a href="#cookies" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                سياسة الكوكيز
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;