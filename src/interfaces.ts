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

export interface BoardConfig {
  name?: string;
  cols: number;
  rows: number;
  target: Cell[];
  master: Cell[];
  movables?: Cell[][];
  walls?: Cell[][];
  destructibles?: Cell[][];
}

export interface DisplayElements {
  host?: HTMLElement;
  name?: HTMLElement;
  moveCount?: HTMLElement;
}

export interface Puzzle {
  name: string;
  difficulty: Difficulty;
  config: BoardConfig;
}

export interface Render {
  render: (context: CanvasRenderingContext2D, cellSize: number, color: string) => void;
}

export interface Movable {
  startCells: Cell[];
  move: (axis: Axis, direction: Direction) => void;
  reset: () => void;
}

export interface Destructible {
  lockState: Map<Cell, boolean>;
  unlocked: boolean;
  unlock: (cell: Cell) => void;
  destroy: (context: CanvasRenderingContext2D, cellSize: number) => void;
  reset: () => void;
}

export interface BorderDescriptor {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
  topLeft: boolean;
  topRight: boolean;
  bottomLeft: boolean;
  bottomRight: boolean;
}
