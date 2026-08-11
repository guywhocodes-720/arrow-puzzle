import { Board } from "@/components/Board";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { AudioProvider } from "@/components/AudioProvider";

export default async function PlayPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  let initialLevel = 1;
  let initialStreak = 0;

  let initialMuted = false;
  let initialVolume = 1.0;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('highest_level, highest_streak, is_muted, volume_multiplier')
      .eq('id', user.id)
      .single();

    if (profile) {
      if (profile.highest_level) initialLevel = profile.highest_level;
      if (profile.highest_streak) initialStreak = profile.highest_streak;
      if (profile.is_muted !== null) initialMuted = profile.is_muted;
      if (profile.volume_multiplier !== null) initialVolume = profile.volume_multiplier;
    }
  } else {
    const guestLevel = cookieStore.get('guest_level')?.value;
    const guestStreak = cookieStore.get('guest_streak')?.value;
    if (guestLevel) initialLevel = parseInt(guestLevel, 10) || 1;
    if (guestStreak) initialStreak = parseInt(guestStreak, 10) || 0;
  }

  return (
    <AudioProvider initialMuted={initialMuted} initialVolume={initialVolume}>
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 w-full mx-auto overflow-hidden relative min-h-[calc(100vh-3.5rem)]">
        <Board initialLevel={initialLevel} initialStreak={initialStreak} />
      </main>
    </AudioProvider>
  );
}
