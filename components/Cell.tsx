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

// All arrows share the same SVG shape (pointing right).
// CSS rotation handles direction. This guarantees pixel-identical size on all devices.
const DIRECTION_ROTATE: Record<Direction, string> = {
    right: 'rotate(0deg)',
    down: 'rotate(90deg)',
    left: 'rotate(180deg)',
    up: 'rotate(270deg)',
};

const ANIMATION_CLASSES: Record<Direction, string> = {
    up: 'animate-slide-up',
    right: 'animate-slide-right',
    down: 'animate-slide-down',
    left: 'animate-slide-left',
};

// SVG: viewBox 0 0 100 100, arrow points right.
// Thin shaft from x=8 to x=62, centered at y=50, height=6px.
// Arrowhead: triangle from x=60 to x=92, spreading from y=50 to ±22.
const ArrowSVG = ({ rotate, color }: { rotate: string; color: string }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{ transform: rotate, display: 'block' }}
        aria-hidden="true"
    >
        {/* Long thin shaft */}
        <rect x="8" y="46" width="54" height="8" rx="4" fill={color} />
        {/* Slim arrowhead */}
        <polygon points="60,28 92,50 60,72" fill={color} />
    </svg>
);

export const Cell: React.FC<CellProps> = ({ data, row, col, isExiting, isError, onClick }) => {
    if (!data) {
        return <div className="w-full h-full aspect-square" aria-hidden="true" />;
    }

    let color = 'currentColor';
    let wrapperClass = 'text-foreground hover:text-primary';

    if (isExiting) {
        wrapperClass = `${ANIMATION_CLASSES[data.direction]} pointer-events-none z-50`;
        color = 'var(--color-primary, oklch(0.7 0.15 190))';
    }
    if (isError) {
        wrapperClass = 'animate-error-shake text-destructive';
        color = 'var(--color-destructive, oklch(0.6 0.2 25))';
    }

    return (
        <button
            type="button"
            onClick={() => onClick(row, col, data.direction)}
            className={`w-full h-full aspect-square flex items-center justify-center p-[15%] active:scale-90 cursor-pointer select-none focus:outline-none touch-manipulation transition-[transform,opacity] duration-75 ${wrapperClass}`}
            aria-label={`Cell at row ${row}, col ${col} pointing ${data.direction}`}
        >
            <ArrowSVG rotate={DIRECTION_ROTATE[data.direction]} color={color} />
        </button>
    );
};