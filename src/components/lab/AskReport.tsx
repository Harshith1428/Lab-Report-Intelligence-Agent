import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { type Language, t } from "@/lib/translations";

interface AskReportProps {
    lang: Language;
}

export function AskReport({ lang }: AskReportProps) {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAsk = () => {
        if (!question.trim()) return;
        setIsLoading(true);
        setTimeout(() => {
            setResponse(
                "Based on your lab results, your hemoglobin level of 11.8 g/dL is slightly below the normal range (12.0–17.5 g/dL). This mild decrease doesn't indicate a serious condition but could suggest early-stage iron deficiency. Consider incorporating more iron-rich foods into your diet and discussing an iron supplement with your healthcare provider."
            );
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="rounded-2xl bg-white border border-blue-100 shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <h2 className="text-lg font-semibold text-slate-800">{t(lang, "askAboutReport")}</h2>
                </div>
                <p className="text-sm text-slate-400 mb-4">{t(lang, "askSubtitle")}</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                        placeholder={t(lang, "askPlaceholder")}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all"
                    />
                    <button
                        onClick={handleAsk}
                        disabled={isLoading || !question.trim()}
                        className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
                {isLoading && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        Analyzing...
                    </div>
                )}
                {response && !isLoading && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                        <p className="text-sm text-slate-600 leading-relaxed">{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
