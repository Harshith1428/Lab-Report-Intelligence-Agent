import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Language, t } from "@/lib/i18n";

interface StickyBottomBarProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
}

const langLabels: Record<Language, string> = {
  en: "EN",
  hi: "हिं",
  te: "తె",
};

export function StickyBottomBar({ lang, onLangChange }: StickyBottomBarProps) {
  const languages: Language[] = ["en", "hi", "te"];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border shadow-lg z-50">
      <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
        <Button
          size="lg"
          variant="outline"
          className="h-14 w-14 rounded-full border-2 border-primary"
          aria-label={t(lang, "voice")}
        >
          <Mic className="h-7 w-7" />
        </Button>

        <div className="flex gap-2">
          {languages.map((l) => (
            <Button
              key={l}
              size="lg"
              variant={lang === l ? "default" : "outline"}
              className="h-12 min-w-[56px] text-lg font-bold"
              onClick={() => onLangChange(l)}
            >
              {langLabels[l]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
