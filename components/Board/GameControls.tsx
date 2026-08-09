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
                className={`px-6 py-2 border text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer ${isGameOver
                    ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
                    : 'border-input text-foreground hover:bg-secondary hover:text-secondary-foreground'
                    }`}
            >
                {isGameOver ? "Try Again" : "Reset"}
            </button>

            <button
                type="button"
                onClick={onNewLevel}
                className="px-6 py-2 border border-foreground text-xs font-semibold text-foreground hover:bg-foreground hover:text-background uppercase tracking-widest transition-colors cursor-pointer"
            >
                {isWon ? "Next Level" : "Random Puzzle"}
            </button>
        </div>
    );
};
