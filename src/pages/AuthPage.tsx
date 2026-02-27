import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Brain, Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

type Mode = "signin" | "signup";

export default function AuthPage() {
    const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
    const [mode, setMode] = useState<Mode>("signin");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Already logged in → go straight to app
    if (!loading && user) {
        return <Navigate to="/" replace />;
    }

    const validate = () => {
        if (!email.includes("@")) return "Please enter a valid email address.";
        if (password.length < 6) return "Password must be at least 6 characters.";
        if (mode === "signup" && name.trim().length < 2) return "Please enter your full name.";
        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setError("");
        setSubmitting(true);
        try {
            if (mode === "signin") {
                await signIn(email, password);
            } else {
                await signUp(name.trim(), email, password);
            }
            setSuccess(true);
        } catch (e: any) {
            setError(e.message ?? "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setGoogleLoading(true);
        try {
            await signInWithGoogle();
        } catch (e: any) {
            setError(e.message ?? "Google sign-in failed. Please try again.");
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* Left panel — branding */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-blue-600 to-cyan-500 p-12 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Brain className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Lab Report AI</span>
                </div>

                <div>
                    <h1 className="text-4xl font-extrabold leading-tight mb-4">
                        Understand your <br />health results <br />
                        <span className="text-cyan-200">in seconds.</span>
                    </h1>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        Upload any lab report PDF and get plain-language explanations, trend tracking, and AI-powered insights — all in one place.
                    </p>

                    <div className="mt-10 flex flex-col gap-4">
                        {[
                            "AI-powered PDF analysis",
                            "Visual health trend charts",
                            "Secure & private by default",
                        ].map((feat) => (
                            <div key={feat} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-blue-100 text-sm">{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-blue-200 text-sm">© 2025 Lab Report AI. All rights reserved.</p>
            </div>

            {/* Right panel — auth form */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Brain className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-slate-800">Lab Report AI</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
                                {mode === "signin" ? <LogIn className="h-5 w-5 text-white" /> : <UserPlus className="h-5 w-5 text-white" />}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                {mode === "signin" ? "Welcome back" : "Create your account"}
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                {mode === "signin"
                                    ? "Sign in to access your lab reports and history."
                                    : "Join Lab Report AI to save and track your results."}
                            </p>
                        </div>

                        {success ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-3">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                                </div>
                                <p className="text-lg font-semibold text-slate-800">
                                    {mode === "signin" ? "Welcome back!" : "Account created!"}
                                </p>
                                <p className="text-sm text-slate-400">Taking you to the app...</p>
                            </div>
                        ) : (
                            <>
                                {/* Google button */}
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={googleLoading || submitting}
                                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-60 mb-4"
                                >
                                    {googleLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                    ) : (
                                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    )}
                                    {googleLoading ? "Redirecting..." : "Continue with Google"}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="text-xs text-slate-400 font-medium">or continue with email</span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {mode === "signup" && (
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="John Doe"
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type={showPass ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all"
                                            />
                                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm hover:from-blue-600 hover:to-cyan-600 disabled:opacity-60 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> {mode === "signin" ? "Signing in..." : "Creating account..."}</>
                                        ) : (
                                            mode === "signin" ? "Sign In" : "Create Account"
                                        )}
                                    </button>
                                </form>

                                <p className="text-center text-sm text-slate-500 mt-5">
                                    {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                                    <button
                                        onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
                                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        {mode === "signin" ? "Sign up" : "Sign in"}
                                    </button>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
