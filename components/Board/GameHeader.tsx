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
      <span className="font-semibold text-lg sm:text-xl tracking-widest uppercase text-black dark:text-white">
        Level {levelNumber}
      </span>

      <div className='flex gap-1 items-center'>
        {[...Array(3)].map((_, i) => (
          <Heart
            key={i}
            className={"w-5 h-5 transition-all duration-300 " + (i < lives ? "fill-red-500 text-red-500 scale-100" : "fill-transparent text-zinc-300 dark:text-zinc-700 scale-90")}
          />
        ))}
      </div>

      {streak > 0 && (
        <span className='text-sm font-bold text-orange-500 uppercase tracking-widest'>
          🔥 {streak} Streak
        </span>
      )}
    </div>
  );
};
