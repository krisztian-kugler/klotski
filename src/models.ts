export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  col: number;
  row: number;
}

export interface GridCell {
  row: number;
  column: number;
}

export interface BoardConfig {
  rows: number;
  columns: number;
  target: GridCell[];
  masterBlock: GridCell[];
  blocks?: GridCell[][];
  walls?: GridCell[][];
  gates?: GridCell[][];
}

export interface Puzzle {
  name: string;
  difficulty: "easy" | "medium" | "hard";
  layout: BoardConfig;
}
