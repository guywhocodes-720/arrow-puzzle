"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";

export function MuteToggle() {
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const muted = localStorage.getItem("arrow_escape_muted") === "true";
        setIsMuted(muted);
    }, []);

    const toggleMute = () => {
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        localStorage.setItem("arrow_escape_muted", nextMuted.toString());
    };

    return (
        <button
            onClick={toggleMute}
            className="flex items-center justify-center p-3 sm:p-4 rounded-xl border border-border bg-popover hover:bg-secondary/20 transition-all text-foreground shrink-0 shadow-sm group"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
            {isMuted ? (
                <VolumeX className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
                <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-primary/80 transition-colors" />
            )}
        </button>
    );
}
