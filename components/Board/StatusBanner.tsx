import React from 'react';

interface StatusBannerProps {
  isWon: boolean;
  isDeadlocked: boolean;
  levelNumber: number;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  isWon,
  isDeadlocked,
}) => {
  if (!isWon && !isDeadlocked) return null;

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
    </div>
  );
};
