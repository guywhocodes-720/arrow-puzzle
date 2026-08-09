import React from 'react';
import { CellData, Direction } from '@/types/game';

interface CellProps {
    data: CellData | null;
    row: number;
    col: number;
    isExiting?: boolean;
    isError?: boolean;
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

export const Cell: React.FC<CellProps> = ({ data, row, col, isExiting, isError, onClick }) => {
    if (!data) {
        return (
            <div
                className="w-full h-full aspect-square"
                aria-hidden="true"
            />
        );
    }

    let animationClass = isExiting ? `${ANIMATION_CLASSES[data.direction]} pointer-events-none z-50 text-primary` : 'text-foreground';
    if (isError) {
        animationClass = 'animate-error-shake text-destructive rounded-lg';
    }

    return (
        <button
            type="button"
            onClick={() => onClick(row, col, data.direction)}
            className={`w-full h-full aspect-square flex items-center justify-center text-[clamp(1.5rem,4vw,3rem)] md:text-[clamp(2rem,3vw,3.5rem)] font-semibold active:scale-95 cursor-pointer select-none focus:outline-none touch-manipulation transition-[transform,color,background-color] duration-75 ${animationClass}`}
            aria-label={`Cell at row ${row}, col ${col} pointing ${data.direction}`}
        >
            {ARROW_SYMBOLS[data.direction]}
        </button>
    );
};