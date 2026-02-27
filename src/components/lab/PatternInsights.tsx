import { Lightbulb } from "lucide-react";
import { type PatternInsight } from "@/lib/labData";
import { type Language, t } from "@/lib/translations";

interface PatternInsightsProps {
    patterns: PatternInsight[];
    lang: Language;
}

export function PatternInsights({ patterns, lang }: PatternInsightsProps) {
    return (
        <div className="rounded-2xl bg-white border border-blue-100 shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <h2 className="text-lg font-semibold text-slate-800">{t(lang, "patternInsights")}</h2>
                </div>
                <p className="text-sm text-slate-400 mb-5">{t(lang, "crossTestAnalysis")}</p>
                <div className="space-y-3">
                    {patterns.map((pattern) => (
                        <div key={pattern.id} className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/30 border border-slate-100 hover:border-blue-200 transition-colors duration-200">
                            <span className="text-2xl shrink-0 mt-0.5">{pattern.icon}</span>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800 mb-1">{pattern.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">{pattern.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
