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

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect(`/register?message=${encodeURIComponent(error.message)}`)
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
