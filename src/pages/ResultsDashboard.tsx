import { useLocation } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { demoReport, generateReportFromMetrics } from "@/lib/labData";
import { SummaryCard } from "@/components/lab/SummaryCard";
import { TestCard } from "@/components/lab/TestCard";
import { PatternInsights } from "@/components/lab/PatternInsights";
import { AskReport } from "@/components/lab/AskReport";
import { Header } from "@/components/lab/Header";
import { Footer } from "@/components/lab/Footer";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

const ResultsDashboard = () => {
    const location = useLocation();
    const metrics = location.state?.metrics;
    const report = metrics ? generateReportFromMetrics(metrics) : demoReport;
    const { lang } = useLang();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-slate-50 to-white">
            <Header />

            <main className="flex-1 px-4 md:px-6 py-6 md:py-8 max-w-5xl mx-auto w-full space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t(lang, "yourLabResults")}</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {t(lang, "reportDate")}: {new Date(report.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>

                <SummaryCard
                    overallInsight={report.overallInsight}
                    healthScore={report.healthScore}
                    riskLevel={report.riskLevel}
                    lang={lang}
                />

                <div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">{t(lang, "testResults")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.tests.map((test) => (
                            <TestCard key={test.id} test={test} lang={lang} />
                        ))}
                    </div>
                </div>

                <PatternInsights patterns={report.patterns} lang={lang} />
                <AskReport lang={lang} metrics={metrics} />

                {/* Disclaimer */}
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-amber-800 mb-1">{t(lang, "medicalDisclaimer")}</h4>
                        <p className="text-xs text-amber-700 leading-relaxed">{t(lang, "disclaimerText")}</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ResultsDashboard;
