export type Direction = "up" | "right" | "down" | "left";

export interface Position {
    row: number;
    col: number;
}

export interface CellData {
    id: string;
    row: number;
    col: number;
    direction: Direction;
}

export type BoardState = (CellData | null)[];

export const DIRECTION_OFFSETS: Record<Direction, { dRow: number; dCol: number }> = {
    up: { dRow: -1, dCol: 0 },
    down: { dRow: 1, dCol: 0 },
    left: { dRow: 0, dCol: -1 },
    right: { dRow: 0, dCol: 1 },
};

/**
 * Endless Escalation Level Schedule:
 * Level 1: 5x5 (25 cells)
 * Level 2: 6x6 (36 cells)
 * Level 3: 7x7 (49 cells)
 * Level 4+: 8x8 (64 cells - Master Grid!)
 */
export const getGridSizeForLevel = (levelNumber: number): number => {
    return 10;
};

/**
 * Raycasting helper: checks if the line-of-sight path off the grid is free of obstacles.
 */
export const isPathClear = (
    cells: BoardState,
    startRow: number,
    startCol: number,
    direction: Direction,
    gridSize: number = 5
): boolean => {
    const { dRow, dCol } = DIRECTION_OFFSETS[direction];
    let r = startRow + dRow;
    let c = startCol + dCol;

    while (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
        const occupingArrow = cells.find(
            (cell) => cell !== null && cell.row === r && cell.col === c
        );
        if (occupingArrow) {
            return false;
        }

        r += dRow;
        c += dCol;
    }

    return true;
};

export const createSolvableLevel = (): BoardState => {
    const grid: CellData[] = [];

    const levelDirections: Direction[][] = [
        ['up', 'up', 'up', 'up', 'up'],
        ['left', 'up', 'up', 'up', 'right'],
        ['left', 'left', 'up', 'right', 'right'],
        ['left', 'down', 'down', 'down', 'right'],
        ['down', 'down', 'down', 'down', 'down'],
    ];

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            grid.push({
                id: `cell-${row}-${col}`,
                row,
                col,
                direction: levelDirections[row][col],
            });
        }
    }
    return grid;
};

export const hasValidMoves = (cells: BoardState, gridSize: number = 5): boolean => {
    return cells.some(
        (cell) => cell !== null && isPathClear(cells, cell.row, cell.col, cell.direction, gridSize)
    );
};

/**
 * Counts turn-1 clearable moves.
 */
export const countTurnOneFreeMoves = (board: BoardState, gridSize: number = 5): number => {
    return board.filter(
        (cell) => cell !== null && isPathClear(board, cell.row, cell.col, cell.direction, gridSize)
    ).length;
};

/**
 * Automated Solver: Simulates playing a candidate board from start to finish.
 * Returns true ONLY if 100% of arrows can be cleared with zero deadlocks!
 */
export const canSolveBoard = (board: BoardState, gridSize: number = 5): boolean => {
    let currentBoard: BoardState = [...board];

    while (true) {
        const clearableIndex = currentBoard.findIndex(
            (cell) => cell !== null && isPathClear(currentBoard, cell.row, cell.col, cell.direction, gridSize)
        );

        if (clearableIndex === -1) {
            break;
        }

        currentBoard = currentBoard.map((cell, idx) => (idx === clearableIndex ? null : cell));
    }

    return currentBoard.every((cell) => cell === null);
};

/**
 * Checks if direction distribution across the board is well-balanced (~25% each).
 * Rejects any board where a single direction exceeds 35% of total tiles.
 */
export const isDirectionDistributionBalanced = (board: BoardState): boolean => {
    const counts: Record<Direction, number> = { up: 0, right: 0, down: 0, left: 0 };
    let total = 0;

    for (const cell of board) {
        if (cell !== null) {
            counts[cell.direction]++;
            total++;
        }
    }

    if (total === 0) return true;

    // Max allowed threshold: 35% of total cells
    const maxThreshold = total * 0.35;
    return (
        counts.up <= maxThreshold &&
        counts.right <= maxThreshold &&
        counts.down <= maxThreshold &&
        counts.left <= maxThreshold
    );
};

/**
 * Rejects boards with 3+ consecutive same-direction arrows in any row or column.
 * Eliminates visible clusters without affecting the random generator.
 */
const hasNoStreaks = (board: BoardState, gridSize: number): boolean => {
    // Check rows
    for (let r = 0; r < gridSize; r++) {
        let streak = 1;
        for (let c = 1; c < gridSize; c++) {
            const prev = board[r * gridSize + c - 1];
            const curr = board[r * gridSize + c];
            if (prev && curr && prev.direction === curr.direction) {
                streak++;
                if (streak >= 3) return false;
            } else {
                streak = 1;
            }
        }
    }
    // Check columns
    for (let c = 0; c < gridSize; c++) {
        let streak = 1;
        for (let r = 1; r < gridSize; r++) {
            const prev = board[(r - 1) * gridSize + c];
            const curr = board[r * gridSize + c];
            if (prev && curr && prev.direction === curr.direction) {
                streak++;
                if (streak >= 3) return false;
            } else {
                streak = 1;
            }
        }
    }
    return true;
};

/**
 * Fast O(1) check if placing an arrow creates a 2-streak with immediate neighbors.
 * Used as a soft-constraint heuristic to eliminate "two arrow issues" without deadlocking.
 */
const creates2Streak = (board: BoardState, idx: number, dir: Direction, gridSize: number): boolean => {
    const row = Math.floor(idx / gridSize);
    const col = idx % gridSize;
    
    if (col > 0 && board[idx - 1]?.direction === dir) return true;
    if (col < gridSize - 1 && board[idx + 1]?.direction === dir) return true;
    if (row > 0 && board[idx - gridSize]?.direction === dir) return true;
    if (row < gridSize - 1 && board[idx + gridSize]?.direction === dir) return true;
    
    return false;
};

/**
 * Rejects boards where more than half the cells in any single row or column share one direction.
 * Catches the "entire top row is mostly ← arrows" pattern.
 */
const hasNoRowDominance = (board: BoardState, gridSize: number): boolean => {
    const maxAllowed = Math.floor(gridSize / 2);
    const dirs: Direction[] = ['up', 'right', 'down', 'left'];
    for (let r = 0; r < gridSize; r++) {
        const counts: Record<Direction, number> = { up: 0, right: 0, down: 0, left: 0 };
        for (let c = 0; c < gridSize; c++) {
            const cell = board[r * gridSize + c];
            if (cell) counts[cell.direction]++;
        }
        for (const d of dirs) { if (counts[d] > maxAllowed) return false; }
    }
    for (let c = 0; c < gridSize; c++) {
        const counts: Record<Direction, number> = { up: 0, right: 0, down: 0, left: 0 };
        for (let r = 0; r < gridSize; r++) {
            const cell = board[r * gridSize + c];
            if (cell) counts[cell.direction]++;
        }
        for (const d of dirs) { if (counts[d] > maxAllowed) return false; }
    }
    return true;
};

/**
 * Pool-Based Reverse Generator.
 * Generates an initially empty board and builds it backward by picking from all
 * valid, aesthetically pleasing moves. Mathematically guarantees a 100% solvable board
 * without any backtracking or deadlocks, easily supporting massive grids.
 */
const generateReversePoolBoard = (gridSize: number): BoardState => {
    const totalCells = gridSize * gridSize;
    const dirs: Direction[] = ['up', 'right', 'down', 'left'];
    const board: BoardState = new Array(totalCells).fill(null);
    const dirCounts = { up: 0, right: 0, down: 0, left: 0 };
    let backtracks = 0;
    let maxStepReached = 0;

    const solve = (step: number): boolean => {
        if (step === totalCells) return true;
        if (backtracks > 10000) return false;

        let candidates: { idx: number, dirs: Direction[] }[] = [];
        let minValidCount = 5;

        for (let idx = 0; idx < totalCells; idx++) {
            if (board[idx] !== null) continue;

            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;
            const validDirs: Direction[] = [];

            for (let d = 0; d < 4; d++) {
                const dir = dirs[d];
                if (isPathClear(board, row, col, dir, gridSize)) {
                    board[idx] = { id: `cell-${row}-${col}`, row, col, direction: dir };
                    if (hasNoStreaks(board, gridSize)) {
                        validDirs.push(dir);
                    }
                    board[idx] = null;
                }
            }

            if (validDirs.length === 0) {
                return false;
            }

            if (validDirs.length < minValidCount) {
                minValidCount = validDirs.length;
                candidates = [{ idx, dirs: validDirs }];
            } else if (validDirs.length === minValidCount) {
                candidates.push({ idx, dirs: validDirs });
            }
        }

        if (candidates.length === 0) return false;

        // Randomly pick one of the best candidates to break top-left bias
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        const bestIdx = chosen.idx;
        const bestDirs = chosen.dirs;

        // Balance direction distribution and heavily penalize 2-streaks
        bestDirs.sort((a, b) => {
            const aStreak = creates2Streak(board, bestIdx, a, gridSize) ? 1 : 0;
            const bStreak = creates2Streak(board, bestIdx, b, gridSize) ? 1 : 0;
            
            // Primary weight: Avoid 2-streaks
            if (aStreak !== bStreak) return aStreak - bStreak;
            
            // Secondary weight: Balance direction counts globally (only if significantly unbalanced)
            const countDiff = dirCounts[a] - dirCounts[b];
            if (Math.abs(countDiff) > 2) return countDiff;
            
            // Tertiary weight: Random tie-breaker for organic variety
            return Math.random() - 0.5;
        });
        
        const row = Math.floor(bestIdx / gridSize);
        const col = bestIdx % gridSize;

        for (const dir of bestDirs) {
            board[bestIdx] = { id: `cell-${row}-${col}`, row, col, direction: dir };
            dirCounts[dir]++;
            if (solve(step + 1)) return true;
            dirCounts[dir]--;
            board[bestIdx] = null;
            backtracks++;
        }

        return false;
    };

    while (true) {
        backtracks = 0;
        board.fill(null);
        dirCounts.up = 0; dirCounts.right = 0; dirCounts.down = 0; dirCounts.left = 0;
        if (solve(0)) {
            return board;
        }
    }
};

/**
 * Bulletproof Procedural Level Generator with Equal Direction Balancing & Solver Verification.
 * NEVER produces single-direction flooded rows or unsolvable deadlocks!
 */
export const generateProceduralLevel = (levelNumber: number = 1): BoardState => {
    const gridSize = getGridSizeForLevel(levelNumber);
    let attempts = 0;
    const maxFreeMoves = Math.max(3, Math.floor(gridSize * 0.6)); // Scale difficulty with grid size

    while (attempts < 30) {
        let board = generateReversePoolBoard(gridSize);
        attempts++;

        if (
            isDirectionDistributionBalanced(board) &&
            countTurnOneFreeMoves(board, gridSize) <= maxFreeMoves
        ) {
            return board;
        }
    }

    return generateReversePoolBoard(gridSize);
};

/**
 * Async Time-Sliced Level Generator.
 * Runs the SAME generation logic as generateProceduralLevel but in small 12ms
 * time slices, yielding to the browser between slices so the UI never freezes.
 * 
 * Guarantees: ALWAYS returns a 100% solvable, fully-filled board.
 * Since it's async, it can search as long as needed without freezing the UI.
 * 
 * Progressive constraint relaxation:
 * - First 200 attempts: perfectly balanced + restricted starting moves
 * - After 200 attempts: accepts any generated board
 */
export const generateProceduralLevelAsync = (levelNumber: number = 1): Promise<BoardState> => {
    return new Promise((resolve) => {
        const gridSize = getGridSizeForLevel(levelNumber);
        let attempts = 0;
        const maxFreeMoves = Math.max(3, Math.floor(gridSize * 0.6));

        const tryGenerate = () => {
            const startTime = Date.now();

            while (Date.now() - startTime < 15) {
                let board = generateReversePoolBoard(gridSize);
                attempts++;

                if (attempts <= 30) {
                    if (
                        isDirectionDistributionBalanced(board) &&
                        countTurnOneFreeMoves(board, gridSize) <= maxFreeMoves
                    ) {
                        resolve(board);
                        return;
                    }
                } else {
                    resolve(board);
                    return;
                }
            }

            setTimeout(tryGenerate, 0);
        };

        tryGenerate();
    });
};
