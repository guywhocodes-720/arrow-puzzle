"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveLevelProgress(newLevel: number, currentStreak: number) {
    try {
        const cookieStore = await cookies();
        cookieStore.set("guest_level", newLevel.toString(), { maxAge: 60 * 60 * 24 * 30 });
        cookieStore.set('guest_streak', currentStreak.toString(), { maxAge: 60 * 60 * 24 * 30 });

        const supabase = createClient(cookieStore);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("highest_streak, highest_level")
                .eq("id", user.id)
                .single();

            const bestStreak = Math.max(profile?.highest_streak || 0, currentStreak);
            const bestLevel = Math.max(profile?.highest_level || 0, newLevel);

            const { error } = await supabase.from("profiles").upsert({
                id: user.id,
                highest_level: bestLevel,
                highest_streak: bestStreak,
            }, { onConflict: "id" });

            if (error) {
                console.error("Failed to save progress to profiles:", error);
            }

            const { data: stats } = await supabase
                .from("game_stats")
                .select("*")
                .eq("user_id", user.id)
                .single();

            const newPuzzlesSolved = (stats?.puzzles_solved || 0) + 1;
            const newGamesPlayed = (stats?.games_played || 0) + 1;
            const newWinRate = Math.round((newPuzzlesSolved / newGamesPlayed) * 100);

            const { error: statsError } = await supabase.from("game_stats").upsert({
                user_id: user.id,
                puzzles_solved: newPuzzlesSolved,
                games_played: newGamesPlayed,
                win_rate: newWinRate,
                current_streak: currentStreak,
                highest_streak: bestStreak,
                updated_at: new Date().toISOString(),
            }, { onConflict: "user_id" });

            if (statsError) {
                console.error("Failed to save progress to game_stats:", statsError);
            }
        }
        revalidatePath("/leaderboard");
    } catch (err) {
        console.error("Error in saveLevelProgress action:", err);
    }
}

export async function saveLevelLoss() {
    try {
        const cookieStore = await cookies();
        cookieStore.set('guest_streak', '0', { maxAge: 60 * 60 * 24 * 30 });

        const supabase = createClient(cookieStore);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: stats } = await supabase
                .from("game_stats")
                .select("*")
                .eq("user_id", user.id)
                .single();

            const currentSolved = stats?.puzzles_solved || 0;
            const newGamesPlayed = (stats?.games_played || 0) + 1;
            const newWinRate = Math.round((currentSolved / newGamesPlayed) * 100);

            const { error: statsError } = await supabase.from("game_stats").upsert({
                user_id: user.id,
                puzzles_solved: currentSolved,
                games_played: newGamesPlayed,
                win_rate: newWinRate,
                current_streak: 0,
                highest_streak: stats?.highest_streak || 0,
                updated_at: new Date().toISOString(),
            }, { onConflict: "user_id" });

            if (statsError) {
                console.error("Failed to save loss to game_stats:", statsError);
            }
        }
        revalidatePath("/leaderboard");
    } catch (err) {
        console.error("Error in saveLevelLoss action:", err);
    }
}
