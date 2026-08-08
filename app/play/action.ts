"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers";

export async function saveLevelProgress(newLevel: number, currentStreak: number) {
    const cookieStore = await cookies();
    cookieStore.set("guest_level", newLevel.toString(), { maxAge: 60 * 60 * 24 * 30 });

    cookieStore.set('guest_streak', currentStreak.toString(), { maxAge: 60 * 60 * 24 * 30 });

    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase.from("profiles").select("highest_streak").eq("id", user.id).single();

    const bestStreak = Math.max(profile?.highest_streak || 0, currentStreak);

    const { error } = await supabase.from("profiles").update({ highest_level: newLevel, highest_streak: bestStreak }).eq("id", user.id);

    if (error) {
        console.error("Faild to save progress", error);
    }
}