import { Axis, Direction } from "./enums";

export type Difficulty = "easy" | "medium" | "hard";

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  col: number;
  row: number;
}

export interface Puzzle {
  name?: string;
  cols: number;
  rows: number;
  target: Cell[];
  master: Cell[];
  movables?: Cell[][];
  walls?: Cell[][];
  gates?: Cell[][];
}

export interface DisplayConfig {
  host?: HTMLElement;
  name?: HTMLElement;
  moveCount?: HTMLElement;
  cellSize?: number;
  moveHistory?: any;
}

export interface BoardConfig {
  puzzle: Puzzle;
  cellSize: number;
  hostElement: HTMLElement;
  nameElement?: HTMLElement;
  moveCountElement?: HTMLElement;
  moveHistory?: any;
}

export interface Render {
  render: (context: CanvasRenderingContext2D, cellSize: number, color?: string) => void;
}

export interface Move {
  move: (axis: Axis, direction: Direction, amount: number) => void;
}

export interface Unlock {
  unlock: (cell: Cell, context: CanvasRenderingContext2D, cellSize: number) => void;
}

export interface Destroy {
  destroy: (context: CanvasRenderingContext2D, cellSize: number) => void;
}

export interface Reset {
  reset: () => void;
}

export interface BorderDescriptor {
  [key: string]: boolean;
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
  topLeft: boolean;
  topRight: boolean;
  bottomLeft: boolean;
  bottomRight: boolean;
}

export interface MoveHistoryEntry {
  from: Cell;
  to: Cell;
  path?: Cell[];
}

export interface CellLockData {
  keyCells: Cell[];
  unlocked: boolean;
}
