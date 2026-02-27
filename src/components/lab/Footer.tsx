import { Link } from "react-router-dom";
import { FileText, Heart, Shield, Mail } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

export function Footer() {
    const { lang } = useLang();
    const year = new Date().getFullYear();

    const links = {
        en: { privacy: "Privacy Policy", terms: "Terms of Use", contact: "Contact Us", disclaimer: "Medical Disclaimer" },
        hi: { privacy: "गोपनीयता नीति", terms: "उपयोग की शर्तें", contact: "संपर्क करें", disclaimer: "चिकित्सा अस्वीकरण" },
        te: { privacy: "గోప్యతా విధానం", terms: "వినియోగ నిబంధనలు", contact: "సంప్రదించండి", disclaimer: "వైద్య నిరాకరణ" },
    };

    const l = links[lang];

    return (
        <footer className="bg-slate-900 text-slate-400 mt-auto">
            {/* Top band */}
            <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Brand */}
                    <div className="space-y-3">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-white font-bold text-base">{t(lang, "appName")}</span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs">
                            {lang === "en"
                                ? "AI-powered lab report analysis that helps you understand your health clearly and confidently."
                                : lang === "hi"
                                    ? "AI-आधारित लैब रिपोर्ट विश्लेषण जो आपको अपनी सेहत को स्पष्ट रूप से समझने में मदद करता है।"
                                    : "AI-ఆధారిత లాబ్ రిపోర్ట్ విశ్లేషణ, మీ ఆరోగ్యాన్ని స్పష్టంగా అర్థం చేసుకోవడానికి సహాయపడుతుంది."}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                            <Shield className="h-3.5 w-3.5" />
                            {lang === "en" ? "HIPAA-compliant · Privacy First" : lang === "hi" ? "गोपनीयता सर्वप्रथम" : "గోప్యత మొదట"}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                            {lang === "en" ? "Quick Links" : lang === "hi" ? "त्वरित लिंक" : "శీఘ్ర లింక్‌లు"}
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link to="/" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                                    {lang === "en" ? "Home" : lang === "hi" ? "होम" : "హోమ్"}
                                </Link>
                            </li>
                            <li>
                                <Link to="/results" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                                    {t(lang, "tryDemo")}
                                </Link>
                            </li>
                            <li>
                                <span className="cursor-pointer hover:text-white transition-colors">{l.disclaimer}</span>
                            </li>
                            <li>
                                <span className="cursor-pointer hover:text-white transition-colors">{l.privacy}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Disclaimer */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                            {t(lang, "medicalDisclaimer")}
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-500">
                            {t(lang, "disclaimerText")}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                            <Mail className="h-3.5 w-3.5" />
                            support@labreportai.com
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <span>© {year} {t(lang, "dashboardFooter")}</span>
                        <span>·</span>
                        <span>{t(lang, "educationalOnly")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {lang === "en" ? "Made with" : lang === "hi" ? "बनाया गया" : "తయారుచేయబడింది"}
                        <Heart className="h-3.5 w-3.5 text-rose-500 mx-1 fill-rose-500" />
                        {lang === "en" ? "for better health literacy" : lang === "hi" ? "बेहतर स्वास्थ्य जागरूकता के लिए" : "మెరుగైన ఆరోగ్య అక్షరాస్యత కోసం"}
                    </div>
                </div>
            </div>
        </footer>
    );
}
