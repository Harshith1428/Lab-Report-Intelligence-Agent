// ────────────────────────────────────────────────────────────────
// src/lib/AuthContext.tsx
//
// Production-ready auth context backed by Supabase Auth.
// The public API (useAuth, AuthProvider, User type) is unchanged
// so no consumer components need to be modified.
// ────────────────────────────────────────────────────────────────

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
    signInWithEmail,
    signUpWithEmail,
    signOut as supabaseSignOut,
    signInWithGoogle as supabaseSignInWithGoogle,
} from "@/lib/supabase/auth";
import { getProfile } from "@/lib/supabase/profiles";

// ── Public types ───────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string; // initials or avatar_url
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
    signInWithGoogle: async () => { },
});

// ── Helper: build a User object from session + profile ─────────
function deriveUser(session: Session | null, fullName?: string | null): User | null {
    if (!session?.user) return null;
    const name = fullName || session.user.user_metadata?.full_name || session.user.email || "User";
    const initials = name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return {
        id: session.user.id,
        name,
        email: session.user.email ?? "",
        avatar: initials,
    };
}

// ── Provider ───────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Sync state whenever auth changes (sign-in, sign-out, token refresh, page reload)
    useEffect(() => {
        // 1. Grab initial session without waiting for a network round-trip
        supabase.auth.getSession().then(async ({ data }) => {
            const s = data.session;
            setSession(s);
            if (s) {
                // Try to enrich the User with profile data
                const profile = await getProfile(s.user.id).catch(() => null);
                setUser(deriveUser(s, profile?.full_name));
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // 2. Subscribe to future auth state changes
        const { data: listener } = supabase.auth.onAuthStateChange(async (_, s) => {
            setSession(s);
            if (s) {
                const profile = await getProfile(s.user.id).catch(() => null);
                setUser(deriveUser(s, profile?.full_name));
            } else {
                setUser(null);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    // ── Auth actions ─────────────────────────────────────────────

    const signIn = async (email: string, password: string) => {
        // onAuthStateChange handles updating user/session state
        await signInWithEmail(email, password);
    };

    const signUp = async (name: string, email: string, password: string) => {
        // The DB trigger auto-creates the profile row after signup
        await signUpWithEmail(email, password, name);
    };

    const signOut = async () => {
        await supabaseSignOut();
        // onAuthStateChange will clear user/session
    };

    const signInWithGoogle = async () => {
        await supabaseSignInWithGoogle();
        // Supabase redirects to Google and back — session handled by onAuthStateChange
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
}

// ── Hook ───────────────────────────────────────────────────────
export function useAuth() {
    return useContext(AuthContext);
}
