import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 mt-12 sm:mt-24">
      <div className="flex flex-col items-center text-center max-w-xl z-10 w-full">
        <h1 className="text-6xl sm:text-8xl font-semibold tracking-tighter text-foreground mb-6 uppercase">
          Arrow
          <br />
          Escape
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg font-medium leading-relaxed max-w-xs sm:max-w-sm mb-16">
          A pure directional logic puzzle. Analyze pathways, clear lines of sight, and empty the grid.
        </p>

        <Link
          href="/play"
          className="px-14 py-5 bg-primary text-primary-foreground font-medium text-sm sm:text-base tracking-widest uppercase rounded-xl border-b-[4px] border-primary/50 hover:brightness-110 active:translate-y-[2px] active:border-b-[2px] duration-75 w-full sm:w-auto text-center shadow-xl"
        >
          {user ? "Resume Game" : "Play Now"}
        </Link>
      </div>
    </main>
  );
}
