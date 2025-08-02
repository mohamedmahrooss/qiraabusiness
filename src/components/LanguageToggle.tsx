import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === 'ar' ? 'EN' : 'AR'}
    </Button>
  );
};