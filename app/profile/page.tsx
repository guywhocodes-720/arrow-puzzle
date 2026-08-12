import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Flame, Star } from "lucide-react";
import { logout } from "@/app/login/action";
import { EditNameDialog } from "@/components/Profile/EditNameDialog";
import { InstallButton } from "@/components/InstallButton";
import { AudioSettings } from "@/components/Profile/AudioSettings";
import { AudioProvider } from "@/components/AudioProvider";

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_muted, volume_multiplier")
        .eq("id", user.id)
        .single();

    const displayName = user.user_metadata?.display_name || "Unknown Player";
    const initial = displayName.charAt(0).toUpperCase();

    const initialMuted = profile?.is_muted ?? false;
    const initialVolume = profile?.volume_multiplier ?? 1.0;

    return (
        <AudioProvider initialMuted={initialMuted} initialVolume={initialVolume}>
            <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-6 sm:px-12 py-16 sm:py-20">

                {/* Elegant Header Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-border pb-6 mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl sm:text-3xl font-semibold shadow-md border border-primary/20 shrink-0">
                        {initial}
                    </div>
                    <div className="flex flex-col items-center sm:items-start justify-center pt-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-foreground uppercase">
                                {displayName}
                            </h1>
                            <EditNameDialog currentName={displayName} />
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest mt-1 font-medium">
                            {user.email}
                        </p>
                    </div>

                    <div className="sm:ml-auto mt-4 sm:mt-0 flex items-center">
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

                {/* Dedicated Audio Settings Section */}
                <AudioSettings />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mt-12 pt-6 border-t border-border">
                    <div className="flex flex-col max-w-md">
                        <h2 className="text-lg font-medium tracking-widest uppercase text-foreground mb-2">
                            Install Arrow Escape
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Add the game to your home screen for full-screen play and instant offline access without opening your browser.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <InstallButton />
                    </div>
                </div>
            </div>
        </AudioProvider>
    );
}
