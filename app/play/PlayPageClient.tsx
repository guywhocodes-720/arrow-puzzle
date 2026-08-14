"use client";

import { useEffect, useState } from "react";
import { Board } from "@/components/Board";
import { AudioProvider } from "@/components/AudioProvider";
import { createClient } from "@/utils/supabase/client";
import { initDB } from "@/utils/indexedDB";
import { Loader2 } from "lucide-react";

export function PlayPageClient() {
  const [initialData, setInitialData] = useState<{
    level: number;
    streak: number;
    muted: boolean;
    volume: number;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      let level = 1;
      let streak = 0;
      let muted = false;
      let volume = 1.0;

      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        const db = await initDB();
        const offlineLevel = await db.get("meta", "offline_level");
        const offlineStreak = await db.get("meta", "offline_streak");
        
        const localMaxLevel = offlineLevel ? parseInt(offlineLevel, 10) : 1;
        const localMaxStreak = offlineStreak ? parseInt(offlineStreak, 10) : 0;

        if (session) {
          try {
            const profile = await db.get("profiles", session.user.id);
            if (profile) {
              level = Math.max(profile.highest_level || 1, localMaxLevel);
              streak = Math.max(profile.highest_streak || 0, localMaxStreak);
              muted = profile.is_muted || false;
              volume = profile.volume_multiplier || 1.0;
            } else if (navigator.onLine) {
              const { data } = await supabase
                .from("profiles")
                .select("highest_level, highest_streak, is_muted, volume_multiplier")
                .eq("id", session.user.id)
                .single();

              if (data) {
                level = Math.max(data.highest_level || 1, localMaxLevel);
                streak = Math.max(data.highest_streak || 0, localMaxStreak);
                muted = data.is_muted || false;
                volume = data.volume_multiplier || 1.0;
              }
            }
          } catch (dbErr) {
            console.error(dbErr);
          }
        } else {
          level = localMaxLevel;
          streak = localMaxStreak;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInitialData({ level, streak, muted, volume });
      }
    };

    loadData();
  }, []);

  if (!initialData) {
    return (
      <div className="flex-1 flex items-center justify-center w-full min-h-[calc(100vh-100px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AudioProvider initialMuted={initialData.muted} initialVolume={initialData.volume}>
      <main className="flex-1 flex flex-col items-center justify-center w-full mx-auto relative p-4 min-h-[calc(100vh-100px)]">
        <Board initialLevel={initialData.level} initialStreak={initialData.streak} />
      </main>
    </AudioProvider>
  );
}
