import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, X } from "lucide-react";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";
import { Link } from "react-router-dom";

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const ApplePodcastIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c4.988 0 7.399 3.378 7.399 6.588 0 1.692-.756 3.726-1.803 4.902-.414.468-.786.456-1.164.216l-.09-.054c-.378-.21-.576-.504-.396-1.068.18-.558.552-1.59.552-2.574 0-2.478-1.86-4.56-4.5-4.56-2.64 0-4.5 2.082-4.5 4.56 0 .984.372 2.016.552 2.574.18.564-.018.858-.396 1.068l-.09.054c-.378.24-.75.252-1.164-.216C5.22 12.636 4.464 10.602 4.464 8.91c0-3.21 2.412-6.342 7.4-6.342zm-.042 4.302c1.44 0 2.556 1.098 2.556 2.442 0 1.35-1.116 2.442-2.556 2.442-1.44 0-2.556-1.092-2.556-2.442 0-1.344 1.116-2.442 2.556-2.442zm-.024 5.628c.756 0 1.35.582 1.422 1.332l.462 4.548c.084.81-.504 1.5-1.344 1.62h-1.08c-.84-.12-1.428-.81-1.344-1.62l.462-4.548c.072-.75.666-1.332 1.422-1.332z"/>
  </svg>
);

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
            <div className="flex gap-2">
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
                  <ApplePodcastIcon />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://open.spotify.com/show/7fioTcz02yXnrHv2rcBldu" target="_blank" rel="noopener noreferrer">
                  <SpotifyIcon />
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
            
            {/* Contact Info - always LTR for consistency */}
            <div className="space-y-3 pt-4" dir="ltr">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">contact@qiraabusiness.online</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">+1 361 470 4099</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Cairo, Egypt</span>
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
