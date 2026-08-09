import React from 'react';
import { Heart } from 'lucide-react';

interface GameHeaderProps {
  levelNumber: number;
  gridSize: number;
  streak: number;
  lives?: number;
  isGameOver?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ levelNumber, streak, lives = 3 }) => {
  return (
    <div className="flex items-center justify-center md:justify-start w-full gap-4 sm:gap-6">
      <span className="font-semibold text-lg sm:text-xl tracking-widest uppercase text-foreground">
        Level {levelNumber}
      </span>

      <div className='flex gap-1 items-center'>
        {[...Array(3)].map((_, i) => (
          <Heart
            key={i}
            className={"w-5 h-5 transition-all duration-300 " + (i < lives ? "fill-destructive text-destructive scale-100" : "fill-transparent text-muted scale-90")}
          />
        ))}
      </div>

      {streak > 0 && (
        <span className='text-sm font-semibold text-primary uppercase tracking-widest'>
          🔥 {streak} Streak
        </span>
      )}
    </div>
  );
};
