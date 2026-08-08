import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { logout } from '@/app/login/action';

export async function Navbar() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="w-full flex justify-center py-8 sm:py-12 px-6 sm:px-12 bg-transparent z-50">
      <div className="w-full max-w-5xl flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter text-black dark:text-white hover:opacity-70 transition-opacity uppercase">
          Arrow Escape
        </Link>
        <div className="flex items-center gap-10">
          <Link href="/play" className="text-sm font-medium text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
            Play
          </Link>
          {user ? (
            <form action={logout}>
              <button type="submit" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
                Sign Out
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
