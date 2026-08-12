import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, Target, Zap, Star, Flame, LogOut, Play } from "lucide-react";
import { logout } from "@/app/login/action";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: stats } = await supabase
    .from('game_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();


  const { data: profile } = await supabase
    .from("profiles")
    .select("highest_level, highest_streak")
    .eq("id", user.id)
    .single();


  const puzzlesSolved = stats?.puzzles_solved || 0;
  const winRate = stats?.win_rate || 0;
  const currentStreak = stats?.current_streak || 0;

  const highestLevel = profile?.highest_level || 1;
  const flawlessStreak = profile?.highest_streak || 0;

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || "Player";

  return (
    <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-6 sm:px-12 py-16 sm:py-20 gap-12">

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 rounded-3xl bg-popover/60 border border-border/80 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle accent glow behind banner */}
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-1.5 z-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Dashboard</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Welcome back, {displayName}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Track your progress, stats, and active streaks.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <Link
            href="/play"
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold text-xs tracking-widest uppercase rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Play className="w-4 h-4 fill-current" /> Play Game
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="px-4 py-3 bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground font-semibold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center gap-2 border border-border/50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Main Dashboard Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Performance & Stats
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Featured Hero Stat: Best Level (Spans 2 cols on desktop) */}
          <div className="md:col-span-2 flex flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-primary/15 via-popover to-popover border border-primary/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Star className="w-56 h-56 text-primary" />
            </div>

            <div className="flex items-center justify-between z-10 mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Primary Milestone</span>
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Star className="w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-col z-10">
              <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">Highest Level Reached</span>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl sm:text-7xl font-black tracking-tight text-foreground">{highestLevel}</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Levels Unlocked</span>
              </div>
            </div>
          </div>

          {/* Flawless Streak (Featured Side Card) */}
          <div className="flex flex-col justify-between p-8 rounded-3xl bg-popover/80 border border-border shadow-xl relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Flame className="w-44 h-44 text-primary" />
            </div>

            <div className="flex items-center justify-between z-10 mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Flawless Streak</span>
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Flame className="w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-col z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-5xl font-extrabold tracking-tight text-primary">{flawlessStreak}</span>
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Max Consecutive Wins</span>
            </div>
          </div>

        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          {/* Puzzles Solved Card */}
          <div className="flex flex-col p-6 rounded-2xl bg-popover/60 border border-border/80 shadow-lg relative overflow-hidden group">
            <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-15 transition-opacity">
              <Trophy className="w-24 h-24 text-foreground" />
            </div>
            <div className="flex items-center gap-2 mb-4 text-muted-foreground z-10">
              <Trophy className="w-4 h-4 text-foreground/80" />
              <span className="text-xs font-bold uppercase tracking-widest">Puzzles Solved</span>
            </div>
            <span className="text-4xl font-extrabold tracking-tight text-foreground z-10">{puzzlesSolved}</span>
          </div>

          {/* Win Rate Card */}
          <div className="flex flex-col p-6 rounded-2xl bg-popover/60 border border-border/80 shadow-lg relative overflow-hidden group">
            <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-15 transition-opacity">
              <Target className="w-24 h-24 text-primary" />
            </div>
            <div className="flex items-center gap-2 mb-4 text-muted-foreground z-10">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest">Win Rate</span>
            </div>
            <span className="text-4xl font-extrabold tracking-tight text-primary z-10">{winRate}%</span>
          </div>

          {/* Current Streak Card */}
          <div className="flex flex-col p-6 rounded-2xl bg-popover/60 border border-border/80 shadow-lg relative overflow-hidden group">
            <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-15 transition-opacity">
              <Zap className="w-24 h-24 text-amber-500" />
            </div>
            <div className="flex items-center gap-2 mb-4 text-muted-foreground z-10">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest">Current Streak</span>
            </div>
            <span className="text-4xl font-extrabold tracking-tight text-amber-500 z-10">{currentStreak}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
