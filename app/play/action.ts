"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers";

export async function saveLevelProgress(newLevel: number) {
    const cookieStore = await cookies();
    cookieStore.set("guest_level", newLevel.toString(), { maxAge: 60 * 60 * 24 * 30 });

    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("profiles").update({ highest_level: newLevel }).eq("id", user.id);

    if (error) {
        console.error("Faild to save progress", error);
    }
}