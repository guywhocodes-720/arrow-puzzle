import React from 'react';
import { Heart } from 'lucide-react';

interface GameHeaderProps {
  levelNumber: number;
  gridSize: number;
  streak: number;
  lives?: number;
  isGameOver?: boolean;
}

import { Flame } from 'lucide-react';

export const GameHeader: React.FC<GameHeaderProps> = ({ levelNumber, streak, lives = 3 }) => {
  return (
    <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center w-full px-2 lg:px-0">
      <div className="flex flex-col items-start lg:items-center">
        <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          LEVEL
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold text-foreground mt-0 sm:mt-2 tracking-tight">
          {levelNumber}
        </h2>
      </div>

      <div className="flex items-center justify-end lg:justify-center gap-4 sm:gap-6 lg:mt-10">
        <div className='flex gap-1 sm:gap-1.5 items-center'>
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className={`w-6 h-6 transition-all duration-300 ${i < lives ? "fill-destructive text-destructive" : "fill-transparent text-muted-foreground/20"}`}
            />
          ))}
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-8 bg-border/50"></div>

        <div className="flex items-center gap-2">
          <Flame className={`w-6 h-6 ${streak > 0 ? "text-primary fill-primary/20" : "text-muted-foreground/30"}`} />
          <div className="flex flex-col items-start leading-none">
            <span className={`text-lg sm:text-xl font-bold ${streak > 0 ? "text-primary" : "text-muted-foreground"}`}>
              {streak}
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
              Streak
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
