import React from 'react';

interface GameControlsProps {
    isWon: boolean;
    isGameOver?: boolean;
    onReset: () => void;
    onNewLevel: () => void;
}

import { RotateCcw, Play } from 'lucide-react';

export const GameControls: React.FC<GameControlsProps> = ({
    isWon,
    isGameOver,
    onReset,
    onNewLevel,
}) => {
    return (
        <div className="flex flex-col gap-4 w-full mt-1 sm:mt-8">
            <button
                type="button"
                onClick={onReset}
                className={`group flex items-center justify-between w-full p-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                    isGameOver 
                    ? 'bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20' 
                    : 'bg-[#1a232f] border border-border/40 hover:bg-[#202b3a] text-slate-300 hover:text-white'
                }`}
            >
                <div className="flex-1 text-center font-bold text-sm tracking-[0.2em]">
                    {isGameOver ? "TRY AGAIN" : "RESET"}
                </div>
                <div className={`flex items-center justify-center p-3 rounded-xl transition-colors ${
                    isGameOver ? 'bg-destructive text-destructive-foreground' : 'bg-[#151e27] group-hover:bg-[#1a232f] text-slate-400 group-hover:text-white'
                }`}>
                    <RotateCcw className="w-5 h-5" strokeWidth={2.5} />
                </div>
            </button>

            {isWon && (
                <button
                    type="button"
                    onClick={onNewLevel}
                    className="group flex items-center justify-between w-full p-1 rounded-2xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all duration-200 active:scale-95"
                >
                    <div className="flex-1 text-center font-bold text-sm tracking-[0.2em]">
                        NEXT LEVEL
                    </div>
                    <div className="flex items-center justify-center p-3 rounded-xl bg-primary text-primary-foreground">
                        <Play className="w-5 h-5 fill-current" strokeWidth={2.5} />
                    </div>
                </button>
            )}
        </div>
    );
};
