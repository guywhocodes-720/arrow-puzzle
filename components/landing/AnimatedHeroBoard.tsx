"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from "lucide-react";

type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";

interface Tile {
  id: number;
  direction: Direction;
  isLeaving: boolean;
  isGone: boolean;
}

const DIRS: Direction[] = ["UP", "RIGHT", "DOWN", "LEFT"];

export function AnimatedHeroBoard() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  // Large grid to fill a background
  const columns = 20;
  const rows = 12;
  const total = columns * rows;

  useEffect(() => {
    const initialTiles = Array.from({ length: total }).map((_, i) => ({
      id: i,
      direction: DIRS[Math.floor(Math.random() * DIRS.length)],
      isLeaving: false,
      isGone: false,
    }));
    setTiles(initialTiles);

    let currentTiles = [...initialTiles];

    const interval = setInterval(() => {
      const remaining = currentTiles.filter((t) => !t.isGone && !t.isLeaving);
      
      if (remaining.length === 0) {
        const newTiles = Array.from({ length: total }).map((_, i) => ({
          id: i,
          direction: DIRS[Math.floor(Math.random() * DIRS.length)],
          isLeaving: false,
          isGone: false,
        }));
        currentTiles = newTiles;
        setTiles(newTiles);
        return;
      }

      // Clear multiple at once since it's a huge board
      for (let i = 0; i < 5; i++) {
          const rem = currentTiles.filter((t) => !t.isGone && !t.isLeaving);
          if (rem.length === 0) break;
          const randomTile = rem[Math.floor(Math.random() * rem.length)];
          currentTiles = currentTiles.map((t) => 
            t.id === randomTile.id ? { ...t, isLeaving: true } : t
          );
      }
      setTiles(currentTiles);

      setTimeout(() => {
        currentTiles = currentTiles.map((t) => 
          t.isLeaving ? { ...t, isLeaving: false, isGone: true } : t
        );
        setTiles([...currentTiles]); 
      }, 400);

    }, 250);

    return () => clearInterval(interval);
  }, []);

  const getAnimationClass = (dir: Direction) => {
    switch (dir) {
      case "UP": return "animate-slide-up";
      case "RIGHT": return "animate-slide-right";
      case "DOWN": return "animate-slide-down";
      case "LEFT": return "animate-slide-left";
    }
  };

  const getIcon = (dir: Direction) => {
    switch (dir) {
      case "UP": return <ArrowUp className="w-6 h-6 sm:w-10 sm:h-10" strokeWidth={3} />;
      case "RIGHT": return <ArrowRight className="w-6 h-6 sm:w-10 sm:h-10" strokeWidth={3} />;
      case "DOWN": return <ArrowDown className="w-6 h-6 sm:w-10 sm:h-10" strokeWidth={3} />;
      case "LEFT": return <ArrowLeft className="w-6 h-6 sm:w-10 sm:h-10" strokeWidth={3} />;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-background pointer-events-none opacity-30">
        <div 
          className="w-full h-full grid gap-4 p-4 min-w-[1200px]" 
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {tiles.map((tile) => (
            <div 
              key={tile.id} 
              className="w-full h-full flex items-center justify-center relative"
            >
              {!tile.isGone && (
                <div
                  className={`absolute flex items-center justify-center text-foreground transition-all duration-300 ${
                    tile.isLeaving ? getAnimationClass(tile.direction) : ""
                  }`}
                >
                  {getIcon(tile.direction)}
                </div>
              )}
            </div>
          ))}
        </div>
    </div>
  );
}
