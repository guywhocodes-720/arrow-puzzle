import React from 'react';

interface GameControlsProps {
    isWon: boolean;
    onReset: () => void;
    onNewLevel: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
    isWon,
    onReset,
    onNewLevel,
}) => {
    return (
        <div className="flex flex-row items-center justify-center md:justify-start gap-6 w-full">
            <button
                type="button"
                onClick={onReset}
                className="px-6 py-2 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 uppercase tracking-widest transition-colors cursor-pointer"
            >
                Reset
            </button>

            <button
                type="button"
                onClick={onNewLevel}
                className="px-6 py-2 border border-black dark:border-white text-xs font-semibold text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black uppercase tracking-widest transition-colors cursor-pointer"
            >
                {isWon ? "Next Level" : "Random Puzzle"}
            </button>
        </div>
    );
};
