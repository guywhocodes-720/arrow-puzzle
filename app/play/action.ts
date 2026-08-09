"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveLevelProgress(newLevel: number, currentStreak: number) {
    const cookieStore = await cookies();
    cookieStore.set("guest_level", newLevel.toString(), { maxAge: 60 * 60 * 24 * 30 });
    cookieStore.set('guest_streak', currentStreak.toString(), { maxAge: 60 * 60 * 24 * 30 });

    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
        .from("profiles")
        .select("highest_streak, highest_level")
        .eq("id", user.id)
        .single();

    const bestStreak = Math.max(profile?.highest_streak || 0, currentStreak);
    const bestLevel = Math.max(profile?.highest_level || 0, newLevel);

    // Use upsert (not update) so old accounts that may be missing a profile row
    // get one created automatically instead of silently doing nothing.
    const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        highest_level: bestLevel,
        highest_streak: bestStreak,
    }, { onConflict: "id" });

    if (error) {
        console.error("Failed to save progress:", error);
    } else {
        revalidatePath("/leaderboard");
        revalidatePath("/play");
    }
}
