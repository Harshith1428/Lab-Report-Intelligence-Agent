import { useState } from "react";
import { Globe, X, ChevronRight } from "lucide-react";
import { type Language, languageNames } from "@/lib/translations";
import { useLang } from "@/lib/LanguageContext";

const LANGUAGES: Language[] = ["en", "hi", "te"];

const flagEmoji: Record<Language, string> = {
    en: "🇬🇧",
    hi: "🇮🇳",
    te: "🇮🇳",
};

export function TranslateBanner() {
    const { lang, setLang } = useLang();
    const [step, setStep] = useState<"prompt" | "options" | "dismissed">("prompt");

    if (step === "dismissed") return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
            {step === "prompt" && (
                <div className="flex items-center gap-3 bg-white border border-blue-200 rounded-2xl px-5 py-3 shadow-xl shadow-blue-500/10">
                    <Globe className="h-5 w-5 text-blue-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-700">Translate this page?</span>
                    <button
                        onClick={() => setStep("options")}
                        className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Choose language <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setStep("dismissed")}
                        className="ml-1 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {step === "options" && (
                <div className="bg-white border border-blue-200 rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-semibold text-slate-700">Select Language</span>
                        </div>
                        <button
                            onClick={() => setStep("dismissed")}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex gap-2 p-3">
                        {LANGUAGES.map((l) => (
                            <button
                                key={l}
                                onClick={() => {
                                    setLang(l);
                                    setStep("dismissed");
                                }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${lang === l
                                        ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/25"
                                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                                    }`}
                            >
                                <span>{flagEmoji[l]}</span>
                                <span>{languageNames[l]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
