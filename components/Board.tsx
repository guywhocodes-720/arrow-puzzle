"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BoardState,
  Direction,
  createSolvableLevel,
  generateProceduralLevelAsync,
  getGridSizeForLevel,
  hasValidMoves,
  isPathClear
} from "@/types/game";
import { Cell } from "./Cell";
import { ModeToggle } from "./mode-toggle";
import { GameHeader } from "./Board/GameHeader";
import { StatusBanner } from "./Board/StatusBanner";
import { GameControls } from "./Board/GameControls";
import { saveLevelProgress } from "@/app/play/action";

interface BoardProps {
  initialLevel?: number;
}

export const Board: React.FC<BoardProps> = ({ initialLevel = 1 }) => {
  const [levelNumber, setLevelNumber] = useState<number>(initialLevel);
  const gridSize = getGridSizeForLevel(levelNumber);

  const [initialCells, setInitialCells] = useState<BoardState>(createSolvableLevel);
  const [cells, setCells] = useState<BoardState>(initialCells);
  const [exitingCellIds, setExitingCellIds] = useState<string[]>([]);
  const [errorCellId, setErrorCellId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    generateProceduralLevelAsync(initialLevel).then((randomLevel) => {
      setInitialCells(randomLevel);
      setCells(randomLevel);
      setIsLoading(false);
    });
  }, [initialLevel]);

  const isWon = cells.every((cell) => cell === null);
  const isDeadlocked = !isWon && !hasValidMoves(cells, gridSize);

  useEffect(() => {
    if (isWon && !isLoading && initialCells.some(c => c !== null)) {
      const timer = setTimeout(() => {
        handleNewLevel();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isWon]);

  const handleResetLevel = () => {
    setExitingCellIds([]);
    setErrorCellId(null);
    setCells(initialCells);
  };

  const handleNewLevel = async () => {
    setExitingCellIds([]);
    setErrorCellId(null);
    const nextLvl = isWon ? levelNumber + 1 : levelNumber;
    if (isWon) {
      setLevelNumber(nextLvl);
      await saveLevelProgress(nextLvl, streak);
    }

    setIsLoading(true);
    generateProceduralLevelAsync(nextLvl).then((newLevel) => {
      setInitialCells(newLevel);
      setCells(newLevel);
      setIsLoading(false);
    });
  };

  const handleCellClick = (row: number, col: number, direction: Direction) => {
    if (isWon || isLoading) return;

    const clickedCell = cells.find(
      (cell) => cell !== null && cell.row === row && cell.col === col
    );

    if (!clickedCell || exitingCellIds.includes(clickedCell.id)) return;

    const activeCells = cells.map(c => (c !== null && exitingCellIds.includes(c.id)) ? null : c);

    if (isPathClear(activeCells, row, col, direction, gridSize)) {
      setStreak((prev) => prev + 1);
      setExitingCellIds((prev) => [...prev, clickedCell.id]);

      setTimeout(() => {
        setCells((prevCells) =>
          prevCells.map((cell) =>
            cell !== null && cell.id === clickedCell.id ? null : cell
          )
        );
        setExitingCellIds((prev) => prev.filter(id => id !== clickedCell.id));
      }, 800);
    } else {
      setStreak(0);
      setErrorCellId(clickedCell.id);
      setTimeout(() => {
        setErrorCellId((current) => current === clickedCell.id ? null : current);
      }, 300);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row items-center justify-between w-full max-w-5xl gap-8 mt-2 md:mt-8">

      {/* Information & Controls (Top on Mobile, Left on Desktop) */}
      <div className="flex flex-col items-center md:items-start justify-center gap-6 w-full md:w-auto shrink-0">

        {/* Header & Status */}
        <div className="flex flex-col items-center md:items-start gap-2 w-full">
          <GameHeader levelNumber={levelNumber} gridSize={gridSize} streak={streak} />
          <StatusBanner isWon={isWon} isDeadlocked={isDeadlocked} levelNumber={levelNumber} />
        </div>

        {/* Action Controls */}
        <div className="w-full">
          <GameControls
            isWon={isWon}
            onReset={handleResetLevel}
            onNewLevel={handleNewLevel}
          />
        </div>

      </div>

      {/* The Board (Middle on Mobile, Right on Desktop) */}
      <div className="flex-1 flex items-center md:justify-end justify-center w-full mt-auto mb-auto">
        <div
          className="grid gap-1 sm:gap-2 relative"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-950/80 rounded-2xl backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-zinc-300 dark:border-zinc-600 border-t-black dark:border-t-white rounded-full animate-spin" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Generating Level {levelNumber}...
                </span>
              </div>
            </div>
          )}

          {cells.map((cell, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const isExiting = cell !== null && exitingCellIds.includes(cell.id);
            const isError = cell !== null && cell.id === errorCellId;

            return (
              <Cell
                key={cell ? cell.id : `empty-${row}-${col}`}
                data={cell}
                row={row}
                col={col}
                isExiting={isExiting}
                isError={isError}
                onClick={handleCellClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};