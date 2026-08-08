import React from 'react';

interface GameHeaderProps {
  levelNumber: number;
  gridSize: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ levelNumber }) => {
  return (
    <div className="flex items-center justify-center md:justify-start w-full">
      <span className="font-semibold text-lg sm:text-xl tracking-widest uppercase text-black dark:text-white">
        Level {levelNumber}
      </span>
    </div>
  );
};
