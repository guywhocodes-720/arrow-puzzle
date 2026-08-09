import Link from "next/link";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full px-6 py-24 text-center">
            <div className="flex flex-col items-center gap-6 max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-popover flex items-center justify-center shadow-2xl shadow-background/50">
                    <Trophy className="w-10 h-10 text-primary" />
                </div>
                
                <h1 className="text-4xl font-black tracking-widest text-foreground uppercase">
                    Leaderboard
                </h1>
                
                <p className="text-lg text-muted-foreground font-medium">
                    Global rankings are coming soon! Keep practicing your puzzle skills and building those win streaks.
                </p>

                <div className="mt-8">
                    <Link
                        href="/play"
                        className="px-8 py-4 bg-primary text-primary-foreground font-bold tracking-widest uppercase hover:brightness-110 rounded-xl border-b-[4px] border-primary/50 active:translate-y-[2px] active:border-b-[2px] duration-75 inline-block"
                    >
                        Play Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
