"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useAudioContext } from "@/components/AudioProvider";

export function AudioSettings() {
    const { isMuted, volumeMultiplier, setAudioSettings } = useAudioContext();

    const toggleMute = () => {
        setAudioSettings(!isMuted, volumeMultiplier);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setAudioSettings(isMuted, newVol);
    };

    return (
        <div className="flex flex-col gap-6 mt-16 pt-8 border-t border-border">
            <h2 className="text-lg font-medium tracking-widest uppercase text-muted-foreground">
                Sounds & Effects
            </h2>
            
            <div className="bg-popover rounded-2xl p-6 sm:p-8 shadow-xl shadow-background/50 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex flex-col">
                    <span className="text-base font-semibold text-foreground uppercase tracking-widest mb-1">
                        Master Volume
                    </span>
                    <span className="text-sm text-muted-foreground">
                        Adjust the global volume for all game sounds.
                    </span>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto">
                    <button
                        onClick={toggleMute}
                        className="flex items-center justify-center p-3 rounded-xl hover:bg-secondary/20 transition-all text-foreground shrink-0 group border border-transparent hover:border-border"
                        title={isMuted ? "Unmute Sound" : "Mute Sound"}
                    >
                        {isMuted || volumeMultiplier === 0 ? (
                            <VolumeX className="w-7 h-7 text-muted-foreground group-hover:text-foreground transition-colors" />
                        ) : (
                            <Volume2 className="w-7 h-7 text-primary group-hover:text-primary/80 transition-colors" />
                        )}
                    </button>

                    <div className="flex flex-col w-full sm:w-48 relative">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volumeMultiplier}
                            onChange={handleVolumeChange}
                            className="w-full h-3 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
                            aria-label="Volume Slider"
                        />
                        <div className="flex justify-between w-full mt-2 text-xs font-semibold text-muted-foreground">
                            <span>0%</span>
                            <span>{Math.round(volumeMultiplier * 100)}%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
