"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateDisplayName(formData: FormData) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const displayName = formData.get("displayName") as string;

    if (displayName && displayName.trim().length >= 3) {

        const cleanName = displayName.trim();

        await supabase.auth.updateUser({
            data: { display_name: cleanName }
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from("profiles").update({ display_name: cleanName }).eq("id", user.id);
        }
        revalidatePath("/", "layout");
    }
}

export async function updateAudioSettings(isMuted: boolean, volumeMultiplier: number) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        await supabase
            .from("profiles")
            .update({ 
                is_muted: isMuted, 
                volume_multiplier: volumeMultiplier 
            })
            .eq("id", user.id);
    }
}
