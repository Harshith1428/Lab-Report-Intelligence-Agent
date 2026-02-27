// ────────────────────────────────────────────────────────────────
// src/lib/supabase/profiles.ts
//
// Data access helpers for the `profiles` table.
// All queries are automatically scoped to the current user
// via Row Level Security — no extra filter needed.
// ────────────────────────────────────────────────────────────────

import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;

// ── Get Profile ───────────────────────────────────────────────
/**
 * Fetches a user's profile row by their auth user ID.
 * Returns null when the profile does not yet exist.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

    if (error) throw error;
    return data;
}

// ── Update Profile ────────────────────────────────────────────
/**
 * Merges partial profile data into the user's profile row.
 * Returns the updated profile.
 *
 * @example
 *   await updateProfile(user.id, { full_name: "Jane Doe" });
 */
export async function updateProfile(
    userId: string,
    updates: Omit<ProfileUpdate, "id" | "email">
): Promise<Profile> {
    const { data, error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}
