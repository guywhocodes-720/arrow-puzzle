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
import { GameHeader } from "./Board/GameHeader";
import { GameControls } from "./Board/GameControls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { saveLevelProgress } from "@/app/play/action";

interface BoardProps {
  initialLevel?: number;
  initialStreak?: number;
}

export const Board: React.FC<BoardProps> = ({ initialLevel = 1, initialStreak = 0 }) => {
  const [levelNumber, setLevelNumber] = useState<number>(initialLevel);
  const gridSize = getGridSizeForLevel(levelNumber);

  const [initialCells, setInitialCells] = useState<BoardState>(createSolvableLevel);
  const [cells, setCells] = useState<BoardState>(initialCells);
  const [exitingCellIds, setExitingCellIds] = useState<string[]>([]);
  const [errorCellId, setErrorCellId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(initialStreak);
  const streakRef = React.useRef(initialStreak);
  const [lives, setLives] = useState<number>(3);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isLevelWonModalOpen, setIsLevelWonModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    generateProceduralLevelAsync(initialLevel).then((randomLevel) => {
      setInitialCells(randomLevel);
      setCells(randomLevel);
      setIsLoading(false);
    });
  }, [initialLevel]);

  const isWon = cells.every((cell) => cell === null);

  useEffect(() => {
    if (isWon && !isLoading && initialCells.some(c => c !== null)) {
      setIsLevelWonModalOpen(true);
    }
  }, [isWon, isLoading, initialCells]);



  const handleResetLevel = () => {
    setExitingCellIds([]);
    setErrorCellId(null);
    setCells(initialCells);
    setLives(3);
    setIsGameOver(false);
    // Streak is NOT reset here — only a wrong click resets it
  };

  const handleNewLevel = async () => {
    // Close the modal first so it can't re-trigger during async load
    setIsLevelWonModalOpen(false);
    setExitingCellIds([]);
    setErrorCellId(null);
    setLives(3);
    setIsGameOver(false);

    const targetLvl = isWon ? levelNumber + 1 : levelNumber;
    if (isWon) {
      setLevelNumber(targetLvl);
    }

    setIsLoading(true);
    generateProceduralLevelAsync(targetLvl).then((newLevel) => {
      setInitialCells(newLevel);
      setCells(newLevel);
      setIsLoading(false);
    });
  };

  const handleCellClick = (row: number, col: number, direction: Direction) => {
    if (isWon || isLoading || isGameOver) return;

    const clickedCell = cells.find(
      (cell) => cell !== null && cell.row === row && cell.col === col
    );

    if (!clickedCell || exitingCellIds.includes(clickedCell.id)) return;

    const activeCells = cells.map(c => (c !== null && exitingCellIds.includes(c.id)) ? null : c);

    if (isPathClear(activeCells, row, col, direction, gridSize)) {
      const nextStreak = streakRef.current + 1;
      streakRef.current = nextStreak;
      setStreak(nextStreak);

      // Check if this is the last cell being cleared (winning move).
      // We fire the save HERE before the 800ms animation, so by the time
      // the modal appears and the user can click any link, the DB write
      // is already done. If we save in useEffect, navigation can abort it.
      const remainingAfterExit = activeCells.filter(
        c => c !== null && c.id !== clickedCell.id
      );
      if (remainingAfterExit.length === 0) {
        saveLevelProgress(levelNumber + 1, nextStreak);
      }

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
      // Wrong click: immediately break the streak
      setStreak(0);
      streakRef.current = 0;
      setErrorCellId(clickedCell.id);

      setLives((prevLives) => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          setIsGameOver(true);
        }
        return newLives;
      });
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
          <GameHeader levelNumber={levelNumber} gridSize={gridSize} streak={streak} lives={lives} isGameOver={isGameOver} />
        </div>

        {/* Action Controls */}
        <div className="w-full">
          <GameControls
            isWon={isWon}
            isGameOver={isGameOver}
            onReset={handleResetLevel}
            onNewLevel={handleNewLevel}
          />
        </div>

      </div>

      {/* The Board (Middle on Mobile, Right on Desktop) */}
      <div className="flex-1 flex items-center md:justify-end justify-center w-full mt-auto mb-auto px-2">
        <div
          className="grid gap-1 sm:gap-2 relative w-full max-w-[92vw] sm:max-w-[75vw] md:max-w-[480px] aspect-square"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 rounded-2xl backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" />
                <span className="text-sm font-medium text-muted-foreground">
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
      {/* Game Over Modal - not dismissible by backdrop click */}
      <Dialog open={isGameOver} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md text-center outline-none border-none" showCloseButton={false}>
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-2xl font-semibold text-destructive uppercase tracking-widest mt-2">Game Over! 💔</DialogTitle>
            <DialogDescription className="text-center text-lg mt-2 font-medium">
              You ran out of lives! But don&apos;t worry, you can try this puzzle again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleResetLevel}
              className="px-8 py-3 bg-destructive text-destructive-foreground font-medium tracking-widest uppercase hover:brightness-110 rounded-xl border-b-[4px] border-destructive/50 active:translate-y-[2px] active:border-b-[2px] duration-75"
            >
              Try Again
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Level Won Modal - not dismissible by backdrop click */}
      <Dialog open={isLevelWonModalOpen} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md text-center outline-none border-none" showCloseButton={false}>
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-2xl font-semibold text-primary uppercase tracking-widest mt-2">Level Cleared! 🎉</DialogTitle>
            <DialogDescription className="text-center text-lg mt-2 font-medium">
              You successfully beat Level {levelNumber}.
              {streak > 1 && <span className="block mt-2 font-semibold text-primary">You are on a {streak} win streak! 🔥</span>}

              <Link href="/leaderboard" className="block mt-4 text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
                Click here to see leaderboard
              </Link>

            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleNewLevel}
              className="px-8 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase hover:brightness-110 rounded-xl border-b-[4px] border-primary/50 active:translate-y-[2px] active:border-b-[2px] duration-75"
            >
              Next Level
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};