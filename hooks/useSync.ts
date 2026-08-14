"use client";

import { useEffect, useState } from "react";
import { initDB } from "@/utils/indexedDB";
import { saveLevelProgress } from "@/app/play/action";

export const useSync = () => {
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !navigator.onLine) return;

        let isMounted = true;

        const syncData = async () => {
            if (isSyncing) return;
            
            try {
                setIsSyncing(true);
                const db = await initDB();
                
                const pendingSync = await db.get("meta", "pending_sync");
                if (pendingSync === "true") {
                    const offlineLevel = await db.get("meta", "offline_level");
                    const offlineStreak = await db.get("meta", "offline_streak");
                    if (offlineLevel && offlineStreak) {
                        try {
                            await saveLevelProgress(parseInt(offlineLevel, 10), parseInt(offlineStreak, 10));
                            await db.put("meta", "false", "pending_sync");
                        } catch (e) {
                            console.error("Failed to sync up progress", e);
                        }
                    }
                }

                const lastSynced = await db.get("meta", "last_synced_level") || 0;

                const res = await fetch(`/api/sync/down?after=${lastSynced}`);
                const data = await res.json();

                if (data.success && isMounted) {
                    const tx = db.transaction(["levels", "profiles", "game_stats", "meta"], "readwrite");
                    
                    if (data.levels && data.levels.length > 0) {
                        data.levels.forEach((level: any) => {
                            tx.objectStore("levels").put(level);
                        });
                        
                        const highestLevel = data.levels[data.levels.length - 1].levelNumber;
                        tx.objectStore("meta").put(highestLevel, "last_synced_level");
                    }

                    if (data.profile) {
                        tx.objectStore("profiles").put(data.profile);
                    }
                    if (data.stats) {
                        tx.objectStore("game_stats").put(data.stats);
                    }

                    await tx.done;
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setIsSyncing(false);
            }
        };

        const timeoutId = setTimeout(() => {
            syncData();
        }, 3000);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, []);

    return { isSyncing };
};
