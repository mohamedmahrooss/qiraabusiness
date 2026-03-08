import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const { isRTL } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("qiraa-cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("qiraa-cookie-consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("qiraa-cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border shadow-2xl">
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          {isRTL
            ? "نستخدم الكوكيز لتحسين تجربتك على المنصة. من خلال الاستمرار في استخدام الموقع، فإنك توافق على "
            : "We use cookies to improve your experience on our platform. By continuing to use the site, you agree to our "}
          <Link to="/cookies" className="text-primary underline">
            {isRTL ? "سياسة الكوكيز" : "Cookie Policy"}
          </Link>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <Button size="sm" variant="outline" onClick={handleDecline}>
            {isRTL ? "رفض" : "Decline"}
          </Button>
          <Button size="sm" onClick={handleAccept}>
            {isRTL ? "قبول" : "Accept"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
