import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Flame, Star } from "lucide-react";
import { logout } from "@/app/login/action";
import { EditNameDialog } from "@/components/Profile/EditNameDialog";

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("highest_level, highest_streak")
        .eq("id", user.id)
        .single();

    const displayName = user.user_metadata?.display_name || "Unknown Player";
    const initial = displayName.charAt(0).toUpperCase();

    const highestLevel = profile?.highest_level || 1;
    const highestStreak = profile?.highest_streak || 0;

    return (
        <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-6 py-12">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-border pb-8 mb-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl sm:text-5xl font-semibold shadow-xl border border-primary/20 shrink-0">
                    {initial}
                </div>
                <div className="flex flex-col items-center sm:items-start justify-center pt-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-widest text-foreground uppercase">
                            {displayName}
                        </h1>
                        <EditNameDialog currentName={displayName} />
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground uppercase tracking-widest mt-1">
                        {user.email}
                    </p>
                </div>

                <div className="sm:ml-auto mt-4 sm:mt-0 flex">
                    <form action={logout}>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-secondary text-secondary-foreground font-medium tracking-widest uppercase hover:brightness-110 rounded-xl border-b-[4px] border-secondary/50 active:translate-y-[2px] active:border-b-[2px] duration-75 text-center"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h2 className="text-lg font-medium tracking-widest uppercase text-muted-foreground">
                    Career Stats
                </h2>
                {/* Stats Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Highest Level Card */}
                    <div className="flex flex-col bg-popover rounded-2xl p-6 shadow-xl shadow-background/50 border border-border relative overflow-hidden group">
                        <div className="absolute right-[-10%] top-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
                            <Star className="w-32 h-32" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4 z-10">Best Level</span>
                        <div className="flex items-center gap-2 z-10">
                            <span className="text-5xl font-semibold text-foreground">{highestLevel}</span>
                        </div>
                    </div>

                    {/* Highest Streak Card */}
                    <div className="flex flex-col bg-popover rounded-2xl p-6 shadow-xl shadow-background/50 border border-border relative overflow-hidden group">
                        <div className="absolute right-[-10%] top-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
                            <Flame className="w-32 h-32" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4 z-10">Best Streak</span>
                        <div className="flex items-center gap-2 z-10">
                            <span className="text-5xl font-semibold text-primary">{highestStreak}</span>
                            <Flame className="w-8 h-8 text-primary ml-1 mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
