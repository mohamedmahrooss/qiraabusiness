import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, Music, X } from "lucide-react";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";
import { Link } from "react-router-dom";
const Footer = () => {
  const { isRTL } = useLanguage();
  const t = useTranslation();
  return <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img src="/images/qiraa-logo.png" alt="QIRAA" className="h-14" />
            <p className="text-secondary-foreground/80 leading-relaxed">
              {isRTL ? 
                "منصة ذكاء سوقي لفهم ديناميكيات الأسواق في منطقة الشرق الأوسط وشمال أفريقيا. من خلال رؤى وتحليلات وتقارير دقيقة، تساعد قراءة صانعي القرار والمستثمرين على رؤية الصورة الكاملة واتخاذ قرارات أكثر استنارة وثقة." :
                "A market intelligence platform for understanding market dynamics in the Middle East and North Africa region. Through accurate insights, analytics, and reports, QIRAA helps decision makers and investors see the complete picture and make more informed and confident decisions."
              }
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://www.facebook.com/qiraabusiness/" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://x.com/qiraabusiness" target="_blank" rel="noopener noreferrer">
                  <X className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://www.linkedin.com/company/qiraabusiness/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://www.instagram.com/qiraabusiness/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://podcasts.apple.com/eg/podcast/qiraa/id1813550545" target="_blank" rel="noopener noreferrer">
                  <Music className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://open.spotify.com/show/7fioTcz02yXnrHv2rcBldu" target="_blank" rel="noopener noreferrer">
                  <Music className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.quickLinks}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t.articles}
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t.reports}
                </Link>
              </li>
              <li>
                <Link to="/qiraa-signals" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t.qiraaSignals}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t.pricing}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.supportHelp}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#help" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t.helpCenter}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t.contactUs}
                </a>
              </li>
              <li>
                <a href="#api" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t.api}
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t.privacyPolicyFooter}
                </a>
              </li>
              <li>
                <a href="#terms" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t.termsOfUse}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.newsletter}</h3>
            <p className="text-secondary-foreground/80 text-sm">{t.newsletterDesc}</p>
            <div className={`flex ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <Input placeholder={t.yourEmail} className="bg-background/10 border-secondary-foreground/20" />
              <Button variant="default" size="sm">
                {t.subscribe}
              </Button>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">contact@qiraabusiness.online</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+1 361 470 4099</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">القاهرة، مصر</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-secondary-foreground/60">
              © 2025 QIRAA. {t.allRightsReserved}
            </div>
            <div className={`flex ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
              <a href="#privacy" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                {t.privacyPolicyFooter}
              </a>
              <a href="#terms" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                {t.termsOfUse}
              </a>
              <a href="#cookies" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                {t.cookiePolicy}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;