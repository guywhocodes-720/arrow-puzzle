"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateDisplayName(formData: FormData) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const displayName = formData.get("displayName") as string;
    
    if (displayName && displayName.trim().length >= 3) {
        await supabase.auth.updateUser({
            data: { display_name: displayName.trim() }
        });
        revalidatePath("/", "layout");
    }
}
