import React from 'react';

interface GameHeaderProps {
  levelNumber: number;
  gridSize: number;
  streak: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ levelNumber, streak }) => {
  return (
    <div className="flex items-center justify-center md:justify-start w-full gap-4 sm:gap-6">
      <span className="font-semibold text-lg sm:text-xl tracking-widest uppercase text-black dark:text-white">
        Level {levelNumber}
      </span>

      {streak > 0 && (
        <span className='text-sm font-bold text-orange-500 uppercase tracking-widest'>
          🔥 {streak} Streak
        </span>
      )}
    </div>
  );
};
