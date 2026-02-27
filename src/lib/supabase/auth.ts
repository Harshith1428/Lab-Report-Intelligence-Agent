// ────────────────────────────────────────────────────────────────
// src/lib/supabase/auth.ts
//
// Reusable auth helpers that wrap the Supabase client.
// Import and call these from AuthContext (or any other consumer).
// ────────────────────────────────────────────────────────────────

import { supabase } from "@/integrations/supabase/client";

// ── Sign In ───────────────────────────────────────────────────
/**
 * Signs in an existing user with email + password.
 * Throws if credentials are invalid.
 */
export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data; // { user, session }
}

// ── Sign Up ───────────────────────────────────────────────────
/**
 * Creates a new user account.
 * `full_name` is stored in user_metadata and auto-copied to the
 * `profiles` table by the database trigger.
 */
export async function signUpWithEmail(
    email: string,
    password: string,
    fullName: string
) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName },
        },
    });
    if (error) throw error;
    return data; // { user, session }
}

// ── Sign In with Google ───────────────────────────────────────
/**
 * Initiates Google OAuth sign-in via Supabase.
 * The user is redirected to Google's consent screen and then
 * back to the app. Supabase handles the session automatically.
 */
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin,
            queryParams: {
                prompt: "select_account",
            },
        },
    });
    if (error) throw error;
    return data;
}

// ── Sign Out ──────────────────────────────────────────────────
/**
 * Signs out the currently authenticated user and clears the
 * local session. Safe to call even when no session exists.
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// ── Get Current Session ───────────────────────────────────────
/**
 * Returns the active session, or null if unauthenticated.
 * Useful for reading the session on page load before the
 * onAuthStateChange listener fires.
 */
export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session; // Session | null
}
