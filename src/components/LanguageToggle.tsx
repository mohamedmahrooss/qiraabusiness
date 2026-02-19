import { Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, LANGUAGE_LABELS, type Language } from "@/hooks/useLanguage";
import { useState, useRef, useEffect } from "react";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const languages = Object.entries(LANGUAGE_LABELS) as [Language, string][];

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-1.5"
      >
        <Globe className="h-4 w-4" />
        {LANGUAGE_LABELS[language]}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>
      {open && (
        <div className="absolute top-full mt-1 right-0 min-w-[140px] bg-card border border-border rounded-xl shadow-xl py-1 z-50">
          {languages.map(([code, label]) => (
            <button
              key={code}
              onClick={() => { setLanguage(code); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${language === code ? 'text-primary font-medium' : 'text-foreground'}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
