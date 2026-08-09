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
        <Link href="/" className="text-xl font-bold tracking-widest text-foreground hover:opacity-70 transition-opacity uppercase">
          Arrow Escape
        </Link>
        <div className="flex items-center gap-10">
          <Link href="/play" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
            Play
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest hidden sm:inline-block">
            Leaderboard
          </Link>
          {user ? (
            <div className="flex items-center gap-6">
              <Link href="/profile" className="text-xs font-semibold text-primary uppercase tracking-widest hidden sm:inline-block hover:brightness-110 transition-all cursor-pointer">
                {user.user_metadata?.display_name || user.email?.split('@')[0]}
              </Link>
              <form action={logout}>
                <button type="submit" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer uppercase tracking-widest">
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
