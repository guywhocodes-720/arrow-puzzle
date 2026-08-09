import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Trophy } from "lucide-react";

export const revalidate = 60;

export default async function LeaderboardPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: leaderboard } = await supabase
        .from("profiles")
        .select("id, display_name, highest_level")
        .order("highest_level", { ascending: false })
        .limit(50);

    return (
        <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-6 py-12">

            {/* Elegant Header Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-border pb-6 mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-md border border-primary/20 shrink-0">
                    <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex flex-col items-center sm:items-start justify-center pt-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-foreground uppercase">
                        Leaderboard
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest mt-1 font-medium">
                        Global Puzzle Rankings
                    </p>
                </div>
            </div>

            {/* Leaderboard List */}
            <div className="flex flex-col gap-3">
                {leaderboard?.map((player, index) => {
                    const isFirst = index === 0;
                    const isSecond = index === 1;
                    const isThird = index === 2;

                    return (
                        <div
                            key={player.id}
                            className={`flex items-center justify-between p-4 rounded-xl border ${isFirst ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]" :
                                    isSecond ? "bg-slate-300/10 border-slate-300/50" :
                                        isThird ? "bg-amber-700/10 border-amber-700/50" :
                                            "bg-popover border-border"
                                }`}
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0 mr-4">
                                <div className={`w-10 h-10 shrink-0 flex items-center justify-center font-bold text-lg rounded-full ${isFirst ? "bg-amber-500 text-white" :
                                        isSecond ? "bg-slate-300 text-slate-800" :
                                            isThird ? "bg-amber-700 text-white" :
                                                "bg-muted text-muted-foreground"
                                    }`}>
                                    {index + 1}
                                </div>
                                <span
                                    className={`font-semibold text-lg uppercase tracking-wider truncate ${isFirst ? "text-amber-500" :
                                            isSecond ? "text-slate-300" :
                                                isThird ? "text-amber-700" :
                                                    "text-foreground"
                                        }`}
                                    title={player.display_name || "Unknown Player"}
                                >
                                    {player.display_name || "Unknown Player"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm text-muted-foreground uppercase tracking-widest">Level</span>
                                <span className="text-2xl font-black text-primary">{player.highest_level || 1}</span>
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
    );
}
