import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { NavbarClient } from './NavbarClient';

export async function Navbar() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  const username = user
    ? (user.user_metadata?.display_name || user.email?.split('@')[0] || null)
    : null;

  return (
    <NavbarClient
      isLoggedIn={!!user}
      username={username}
    />
  );
}
