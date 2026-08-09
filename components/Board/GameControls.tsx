import React from 'react';

interface GameControlsProps {
    isWon: boolean;
    isGameOver?: boolean;
    onReset: () => void;
    onNewLevel: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
    isWon,
    isGameOver,
    onReset,
    onNewLevel,
}) => {
    return (
        <div className="flex flex-row items-center justify-center md:justify-start gap-6 w-full">
            <button
                type="button"
                onClick={onReset}
                className={`px-6 py-2 text-xs font-medium uppercase tracking-widest cursor-pointer rounded-xl duration-75 ${isGameOver
                    ? 'bg-destructive text-destructive-foreground hover:brightness-110 border-b-[4px] border-destructive/50 active:translate-y-[2px] active:border-b-[2px]'
                    : 'bg-secondary text-secondary-foreground hover:brightness-110 border-b-[4px] border-secondary/50 active:translate-y-[2px] active:border-b-[2px]'
                    }`}
            >
                {isGameOver ? "Try Again" : "Reset"}
            </button>

            <button
                type="button"
                onClick={onNewLevel}
                className="px-6 py-2 bg-secondary text-secondary-foreground text-xs font-medium uppercase tracking-widest cursor-pointer rounded-xl border-b-[4px] border-secondary/50 hover:brightness-110 active:translate-y-[2px] active:border-b-[2px] duration-75"
            >
                {isWon ? "Next Level" : "Random Puzzle"}
            </button>
        </div>
    );
};
