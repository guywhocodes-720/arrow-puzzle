import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Trophy, Flame } from "lucide-react";



export default async function LeaderboardPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: leaderboard, error } = await supabase
        .from("profiles")
        .select("id, display_name, highest_level, highest_streak")
        .order("highest_level", { ascending: false })
        .limit(50);

    return (
        <main className="flex-1 flex flex-col w-full">
            <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-6 sm:px-12 py-16 sm:py-20">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-border pb-6 mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-md border border-primary/20 shrink-0">
                    <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex flex-col items-center sm:items-start justify-center pt-1">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-widest text-foreground uppercase">
                        Leaderboard
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest mt-1 font-medium">
                        Global Puzzle Rankings
                    </p>
                </div>
            </div>

            {/* Column Headers */}
            {leaderboard && leaderboard.length > 0 && (
                <div className="grid grid-cols-[3rem_1fr_auto_auto] gap-4 px-4 mb-2">
                    <div />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Player</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-right">Flawless Streak</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-right">Level</span>
                </div>
            )}

            {/* Leaderboard List */}
            <div className="flex flex-col gap-3">
                {leaderboard?.map((player, index) => {
                    const isFirst = index === 0;
                    const isSecond = index === 1;
                    const isThird = index === 2;

                    return (
                        <div
                            key={player.id}
                            className={`grid grid-cols-[3rem_1fr_auto_auto] gap-4 items-center p-4 rounded-xl border ${
                                isFirst ? "bg-amber-500/10 border-amber-500/40" :
                                isSecond ? "bg-slate-400/10 border-slate-400/40" :
                                isThird ? "bg-amber-700/10 border-amber-700/40" :
                                "bg-popover border-border"
                            }`}
                        >
                            <div className={`w-10 h-10 shrink-0 flex items-center justify-center font-semibold text-base rounded-full ${
                                isFirst ? "bg-amber-500 text-white" :
                                isSecond ? "bg-slate-400 text-slate-900" :
                                isThird ? "bg-amber-700 text-white" :
                                "bg-muted text-muted-foreground"
                            }`}>
                                {index + 1}
                            </div>

                            <span
                                className="font-medium text-base uppercase tracking-wider truncate text-foreground"
                                title={player.display_name || "Unknown Player"}
                            >
                                {player.display_name || "Unknown Player"}
                            </span>

                            <div className="flex items-center gap-1.5 justify-end">
                                <span className="text-xl font-semibold text-foreground">{player.highest_streak || 0}</span>
                                <Flame className="w-4 h-4 text-primary" />
                            </div>

                            <div className="flex items-center gap-1.5 justify-end">
                                <span className="text-xs text-muted-foreground uppercase tracking-widest">Lvl</span>
                                <span className="text-2xl font-semibold text-primary">{player.highest_level || 1}</span>
                            </div>
                        </div>
                    );
                })}

                {(!leaderboard || leaderboard.length === 0) && (
                    <div className="p-8 text-center bg-popover rounded-xl border border-border">
                        <p className="text-muted-foreground font-medium uppercase tracking-widest">No scores yet. Be the first!</p>
                    </div>
                )}
            </div>
        </div>
    </main>
  );
}

