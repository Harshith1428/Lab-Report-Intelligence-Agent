import { Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { getRiskColor } from "@/lib/labData";
import { type Language, t } from "@/lib/translations";

interface SummaryCardProps {
    overallInsight: string;
    healthScore: number;
    riskLevel: "Low" | "Moderate" | "High";
    lang: Language;
}

export function SummaryCard({ overallInsight, healthScore, riskLevel, lang }: SummaryCardProps) {
    const scoreColor =
        healthScore >= 80 ? "from-emerald-400 to-emerald-600"
            : healthScore >= 60 ? "from-amber-400 to-amber-600"
                : "from-rose-400 to-rose-600";

    const scoreRingColor =
        healthScore >= 80 ? "border-emerald-200"
            : healthScore >= 60 ? "border-amber-200"
                : "border-rose-200";

    const riskKey = riskLevel === "Low" ? "low_risk" : riskLevel === "Moderate" ? "moderate_risk" : "high_risk";

    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-blue-100 shadow-lg shadow-blue-500/5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500" />
            <div className="p-6 md:p-8">
                <div className="flex items-start gap-2 mb-4">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <h2 className="text-lg font-semibold text-slate-800">{t(lang, "overallInsight")}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 text-[15px]">{overallInsight}</p>
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                        <div className={`w-14 h-14 rounded-full border-4 ${scoreRingColor} flex items-center justify-center bg-gradient-to-br ${scoreColor} shadow-md`}>
                            <span className="text-lg font-bold text-white">{healthScore}</span>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{t(lang, "healthStability")}</p>
                            <p className="text-sm font-semibold text-slate-700">{t(lang, "score")}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                        <div className="flex items-center gap-2">
                            {riskLevel === "High" ? <AlertTriangle className="h-5 w-5 text-rose-500" /> : <TrendingUp className="h-5 w-5 text-emerald-500" />}
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{t(lang, "riskLevel")}</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRiskColor(riskLevel)}`}>
                                    {t(lang, riskKey)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
