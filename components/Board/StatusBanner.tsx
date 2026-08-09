import React from 'react';

interface StatusBannerProps {
  isWon: boolean;
  isDeadlocked: boolean;
  levelNumber: number;
  isGameOver?: boolean;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  isWon,
  isDeadlocked,
  isGameOver
}) => {
  if (!isWon && !isDeadlocked && !isGameOver) return null;

  return (
    <div className="w-full flex justify-center md:justify-start">
      {isWon && (
        <span className="text-sm font-medium tracking-widest text-black dark:text-white uppercase">
          Level Cleared
        </span>
      )}

      {isDeadlocked && (
        <span className="text-sm font-medium tracking-widest text-zinc-500 uppercase">
          No Valid Moves
        </span>
      )}

      {isGameOver && (
        <span className='text-sm font-medium tracking-widest text-red-500 uppercase'>
          Game Over! Out of lives
        </span>
      )}
    </div>
  );
};
