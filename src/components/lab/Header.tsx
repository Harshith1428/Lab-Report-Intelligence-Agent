import { Link, useNavigate } from "react-router-dom";
import { FileText, Globe, ChevronDown, Home, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { type Language, languageNames, t } from "@/lib/translations";
import { useAuth } from "@/lib/AuthContext";
import { AuthModal } from "@/components/lab/AuthModal";

const LANGUAGES: Language[] = ["en", "hi", "te"];
const flagEmoji: Record<Language, string> = { en: "🇬🇧", hi: "🇮🇳", te: "🇮🇳" };

export function Header() {
    const { lang, setLang } = useLang();
    const { user, signOut } = useAuth();
    const [showLang, setShowLang] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-base font-bold text-slate-800">{t(lang, "appName")}</span>
                            <p className="text-[10px] text-slate-400 leading-none">Intelligence Agent</p>
                        </div>
                    </Link>

                    {/* Nav links */}
                    <nav className="hidden md:flex items-center gap-1">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            {lang === "en" ? "Home" : lang === "hi" ? "होम" : "హోమ్"}
                        </button>
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Language switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLang((p) => !p)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm font-medium text-slate-700"
                            >
                                <Globe className="h-4 w-4 text-blue-500" />
                                <span>{flagEmoji[lang]}</span>
                                <span className="hidden sm:inline">{languageNames[lang]}</span>
                                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${showLang ? "rotate-180" : ""}`} />
                            </button>

                            {showLang && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowLang(false)} />
                                    <div className="absolute right-0 top-12 z-20 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden min-w-[150px]">
                                        <div className="px-3 py-2 border-b border-slate-100">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Language</p>
                                        </div>
                                        {LANGUAGES.map((l) => (
                                            <button
                                                key={l}
                                                onClick={() => { setLang(l); setShowLang(false); }}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-blue-50 transition-colors ${lang === l ? "text-blue-600 font-semibold bg-blue-50" : "text-slate-700"}`}
                                            >
                                                <span>{flagEmoji[l]}</span>
                                                {languageNames[l]}
                                                {lang === l && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Auth section */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu((p) => !p)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50 transition-all"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                                        {user.avatar || user.name[0].toUpperCase()}
                                    </div>
                                    <span className="hidden sm:inline text-sm font-medium text-slate-700 max-w-[100px] truncate">{user.name}</span>
                                    <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                                </button>

                                {showUserMenu && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                                        <div className="absolute right-0 top-12 z-20 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden min-w-[180px]">
                                            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                                                <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => { navigate("/results"); setShowUserMenu(false); }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                            >
                                                <FileText className="h-4 w-4 text-blue-500" />
                                                My Reports
                                            </button>
                                            <button
                                                onClick={() => { signOut(); setShowUserMenu(false); }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Sign In</span>
                                </button>
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-md shadow-blue-500/20 transition-all"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span className="hidden sm:inline">Sign Up</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </>
    );
}
