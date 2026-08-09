'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from "next/headers";

export async function login(formData: FormData) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    
    const displayName = formData.get('displayName') as string;

    const { error, data: authData } = await supabase.auth.signUp({
        ...data,
        options: {
            data: {
                display_name: displayName,
            }
        }
    })

    if (error) {
        redirect(`/register?message=${encodeURIComponent(error.message)}`)
    }

    const guestLevelStr = cookieStore.get("guest_level")?.value;
    if (guestLevelStr && authData.user) {
        const guestLevel = parseInt(guestLevelStr, 10);
        if (guestLevel > 1) {
            await supabase.from("profiles").update({ highest_level: guestLevel }).eq("id", authData.user.id);
            cookieStore.delete("guest_level")
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logout() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}
