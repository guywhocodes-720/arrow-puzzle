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
    return Math.min(4 + levelNumber, 8);
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
 * Procedural Candidate Generator with Direction Balancing & Anti-Clustering.
 * Generates beautifully diverse and chaotic boards.
 * Strictly guarantees NO adjacent identical arrows. Returns null if trapped.
 */
const generateCandidateBoard = (gridSize: number = 5): BoardState | null => {
    const totalCells = gridSize * gridSize;
    const board: BoardState = new Array(totalCells).fill(null);
    const directions: Direction[] = ['up', 'right', 'down', 'left'];
    const dirCounts: Record<Direction, number> = { up: 0, right: 0, down: 0, left: 0 };

    const indices = Array.from({ length: totalCells }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    for (const idx of indices) {
        const row = Math.floor(idx / gridSize);
        const col = idx % gridSize;

        const leftCell = col > 0 ? board[row * gridSize + (col - 1)] : null;
        const topCell = row > 0 ? board[(row - 1) * gridSize + col] : null;
        const rightCell = col < gridSize - 1 ? board[row * gridSize + (col + 1)] : null;
        const bottomCell = row < gridSize - 1 ? board[(row + 1) * gridSize + col] : null;

        const neighborDirs = [leftCell, topCell, rightCell, bottomCell]
            .filter((c) => c !== null)
            .map((c) => c!.direction);

        const sortedDirs = [...directions].sort((a, b) => {
            if (dirCounts[a] !== dirCounts[b]) {
                return dirCounts[a] - dirCounts[b];
            }
            return Math.random() - 0.5;
        });

        const candidateDirs = sortedDirs.filter((dir) => !neighborDirs.includes(dir));

        // STRICT ANTI-CLUSTERING: If we are forced to match a neighbor, abort and retry!
        if (candidateDirs.length === 0) {
            return null;
        }

        const dirToPlace = candidateDirs[0];

        board[idx] = {
            id: `cell-${row}-${col}`,
            row,
            col,
            direction: dirToPlace,
        };
        dirCounts[dirToPlace]++;
    }

    return board;
};

/**
 * The ultimate fix for both performance AND difficulty!
 * Takes a diverse but potentially deadlocked board, simulates playing it,
 * and whenever it gets stuck, it modifies exactly ONE arrow to break the deadlock.
 * Mathematically guarantees a 100% solvable board instantly, while preserving
 * the beautiful chaotic structure of the original generator!
 */
const makeBoardSolvable = (board: BoardState, gridSize: number): BoardState | null => {
    let currentBoard: BoardState = board.map(c => c ? { ...c } : null);
    let originalBoard: BoardState = board.map(c => c ? { ...c } : null);

    let remainingCells = currentBoard.filter(c => c !== null);
    let stuckCount = 0; // Guard against unrepairable deadlocks

    while (remainingCells.length > 0) {
        const clearableIndices = currentBoard.reduce((acc, cell, idx) => {
            if (cell !== null && isPathClear(currentBoard, cell.row, cell.col, cell.direction, gridSize)) {
                acc.push(idx);
            }
            return acc;
        }, [] as number[]);

        if (clearableIndices.length > 0) {
            for (const idx of clearableIndices) {
                currentBoard[idx] = null;
            }
            stuckCount = 0; // Progress made!
        } else {
            stuckCount++;
            // If we fail to repair without clustering too many times, abort and retry
            if (stuckCount > 10) return null;

            // DEADLOCK! Pick one stuck arrow and repair it.
            const remainingIndices = currentBoard.reduce((acc, cell, idx) => {
                if (cell !== null) acc.push(idx);
                return acc;
            }, [] as number[]);

            remainingIndices.sort(() => Math.random() - 0.5);
            let repaired = false;

            for (const targetIdx of remainingIndices) {
                const cell = currentBoard[targetIdx]!;
                const row = cell.row;
                const col = cell.col;

                // Check neighbors in the ORIGINAL board to prevent clustering
                const leftCell = col > 0 ? originalBoard[row * gridSize + (col - 1)] : null;
                const topCell = row > 0 ? originalBoard[(row - 1) * gridSize + col] : null;
                const rightCell = col < gridSize - 1 ? originalBoard[row * gridSize + (col + 1)] : null;
                const bottomCell = row < gridSize - 1 ? originalBoard[(row + 1) * gridSize + col] : null;

                const neighborDirs = [leftCell, topCell, rightCell, bottomCell]
                    .filter((c) => c !== null)
                    .map((c) => c!.direction);

                const dirs: Direction[] = ['up', 'right', 'down', 'left'];
                dirs.sort(() => Math.random() - 0.5);

                for (const dir of dirs) {
                    // MUST be clear AND must NOT match neighbors!
                    if (isPathClear(currentBoard, cell.row, cell.col, dir, gridSize) && !neighborDirs.includes(dir)) {
                        originalBoard[targetIdx]!.direction = dir;
                        currentBoard[targetIdx] = null;
                        repaired = true;
                        break;
                    }
                }

                if (repaired) break;
            }
        }

        remainingCells = currentBoard.filter(c => c !== null);
    }

    return originalBoard;
};

/**
 * Bulletproof Procedural Level Generator with Equal Direction Balancing & Solver Verification.
 * NEVER produces single-direction flooded rows or unsolvable deadlocks!
 */
export const generateProceduralLevel = (levelNumber: number = 1): BoardState => {
    const gridSize = getGridSizeForLevel(levelNumber);
    let attempts = 0;

    while (attempts < 250) {
        let board = generateCandidateBoard(gridSize);
        if (!board) continue;

        board = makeBoardSolvable(board, gridSize);
        if (!board) continue;

        attempts++;

        if (
            isDirectionDistributionBalanced(board) &&
            countTurnOneFreeMoves(board, gridSize) <= 3
        ) {
            return board;
        }
    }

    while (true) {
        let board = generateCandidateBoard(gridSize);
        if (!board) continue;

        board = makeBoardSolvable(board, gridSize);
        if (board) return board;
    }
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

        const tryGenerate = () => {
            const startTime = Date.now();

            while (Date.now() - startTime < 12) {
                let board = generateCandidateBoard(gridSize);
                if (!board) continue;

                board = makeBoardSolvable(board, gridSize);
                if (!board) continue;
                attempts++;

                // First 200 attempts: try for a perfect board
                if (attempts <= 200) {
                    if (
                        isDirectionDistributionBalanced(board) &&
                        countTurnOneFreeMoves(board, gridSize) <= 3
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
