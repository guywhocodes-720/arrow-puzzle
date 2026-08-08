import React from 'react';
import { CellData, Direction } from '@/types/game';

interface CellProps {
    data: CellData | null;
    row: number;
    col: number;
    isExiting?: boolean;
    onClick: (row: number, col: number, direction: Direction) => void;
}

const ARROW_SYMBOLS: Record<Direction, string> = {
    up: '↑',
    right: '→',
    down: '↓',
    left: '←',
};

const ANIMATION_CLASSES: Record<Direction, string> = {
    up: 'animate-slide-up',
    right: 'animate-slide-right',
    down: 'animate-slide-down',
    left: 'animate-slide-left',
};

export const Cell: React.FC<CellProps> = ({ data, row, col, isExiting, onClick }) => {
    // Render empty slot if arrow has cleared
    if (!data) {
        return (
            <div
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
                aria-hidden="true"
            />
        );
    }

    const animationClass = isExiting ? ANIMATION_CLASSES[data.direction] : '';

    return (
        <button
            type="button"
            onClick={() => onClick(row, col, data.direction)}
            className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center text-4xl sm:text-5xl font-black text-black dark:text-white hover:opacity-70 active:scale-95 transition-all cursor-pointer select-none focus:outline-none ${animationClass}`}
            aria-label={`Cell at row ${row}, col ${col} pointing ${data.direction}`}
        >
            {ARROW_SYMBOLS[data.direction]}
        </button>
    );
};