import { openDB, DBSchema } from "idb";
import { BoardState } from "@/types/game";

interface GameDB extends DBSchema {
    levels: {
        key: number;
        value: {
            levelNumber: number;
            boardData: BoardState;
        };
    };
    profiles: {
        key: string;
        value: {
            id: string;
            highest_level: number;
            highest_streak: number;
            is_muted: boolean;
            volume_multiplier: number;
        };
    };
    game_stats: {
        key: string;
        value: {
            user_id: string;
            puzzles_solved: number;
            games_played: number;
            win_rate: number;
            current_streak: number;
            highest_streak: number;
            updated_at: string;
        };
    };
    meta: {
        key: string;
        value: any;
    };
}

export const initDB = async () => {
    return openDB<GameDB>("arrow-escape-db", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("levels")) {
                db.createObjectStore("levels", {
                    keyPath: "levelNumber"
                });
            }

            if (!db.objectStoreNames.contains("profiles")) {
                db.createObjectStore("profiles", {
                    keyPath: "id"
                });
            }

            if (!db.objectStoreNames.contains("game_stats")) {
                db.createObjectStore("game_stats", {
                    keyPath: "user_id"
                });
            }

            if (!db.objectStoreNames.contains("meta")) {
                db.createObjectStore("meta")
            }
        },
    });
};


export const dbHelpers = {
    getLevel: async (levelNumber: number) => {
        const db = await initDB();
        return db.get("levels", levelNumber);
    },

    saveLevelBulk: async (levels: {
        levelNumber: number; boardData: BoardState
    }[]) => {
        const db = await initDB();
        const tx = db.transaction("levels", "readwrite");
        levels.forEach(level => tx.store.put(level));
        await tx.done;
    },

    saveProfile: async (profileData: any) => {
        const db = await initDB();
        await db.put("profiles", profileData);
    },

    saveStats: async (statsData: any) => {
        const db = await initDB();
        await db.put('game_stats', statsData);
    }
}