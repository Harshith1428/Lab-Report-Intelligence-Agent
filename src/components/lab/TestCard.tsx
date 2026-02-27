import { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, Apple } from "lucide-react";
import { type TestResult, getStatusColor, getProgressPercent } from "@/lib/labData";
import { type Language, t } from "@/lib/translations";

interface TestCardProps {
    test: TestResult;
    lang: Language;
}

export function TestCard({ test, lang }: TestCardProps) {
    const [expanded, setExpanded] = useState(false);
    const colors = getStatusColor(test.status);
    const progressPercent = getProgressPercent(test.value, test.normalRange.min, test.normalRange.max);
    const statusKey = test.status === "normal" ? "normal" : test.status === "low" ? "low" : "high";

    return (
        <div className={`relative rounded-2xl border ${colors.border} ${colors.bg} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}>
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-[15px] font-semibold text-slate-800 leading-tight pr-2">{test.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${colors.badge}`}>
                        {t(lang, statusKey)}
                    </span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-3xl font-bold text-slate-900 tabular-nums">{test.value}</span>
                    <span className="text-sm text-slate-500 font-medium">{test.unit}</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                    {t(lang, "normalRange")}: {test.normalRange.min}–{test.normalRange.max} {test.unit}
                </p>
                <div className="relative h-2.5 bg-white/80 rounded-full overflow-hidden border border-slate-200/60 mb-3">
                    <div
                        className="absolute top-0 bottom-0 bg-emerald-100/60 rounded-full"
                        style={{
                            left: `${getProgressPercent(test.normalRange.min, test.normalRange.min, test.normalRange.max)}%`,
                            right: `${100 - getProgressPercent(test.normalRange.max, test.normalRange.min, test.normalRange.max)}%`,
                        }}
                    />
                    <div
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${colors.bar} shadow-md border-2 border-white transition-all duration-500`}
                        style={{ left: `calc(${progressPercent}% - 8px)` }}
                    />
                </div>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
                >
                    {expanded ? <><ChevronUp className="h-3.5 w-3.5" />{t(lang, "hideExplanation")}</> : <><ChevronDown className="h-3.5 w-3.5" />{t(lang, "showExplanation")}</>}
                </button>
                <div className={`grid transition-all duration-300 ${expanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden space-y-3">
                        <p className="text-sm text-slate-600 leading-relaxed bg-white/60 rounded-lg p-3 border border-slate-100">
                            {test.explanation}
                        </p>

                        {/* Possible Causes */}
                        {test.causes && test.causes.length > 0 && (
                            <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100/50">
                                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-orange-800 uppercase tracking-wide mb-2">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {t(lang, "possibleCauses")}
                                </h4>
                                <ul className="space-y-1.5">
                                    {test.causes.map((cause, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                            <span className="text-orange-400 mt-0.5">•</span>
                                            <span className="leading-tight">{cause}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Suggested Intakes / Remedies */}
                        {test.suggestedIntakes && test.suggestedIntakes.length > 0 && (
                            <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100/50">
                                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-2">
                                    <Apple className="h-3.5 w-3.5" />
                                    {t(lang, "suggestedIntakes")}
                                </h4>
                                <ul className="space-y-1.5">
                                    {test.suggestedIntakes.map((intake, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                            <span className="text-emerald-400 mt-0.5">+</span>
                                            <span className="leading-tight">{intake}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
