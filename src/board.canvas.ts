import { Position, Cell, BoardConfig } from "./models";
import CoverageMatrix from "./coverage-matrix";

export default class Board {
  boardElement: HTMLCanvasElement;
  coverageMatrix: CoverageMatrix;
  cols: number;
  rows: number;
  cellSize: number = 30;

  constructor(config: BoardConfig) {
    this.cols = config.columns;
    this.rows = config.rows;
  }

  private getPosition(event: PointerEvent): Position {
    const boardElementRect = this.boardElement.getBoundingClientRect();
    const x = Math.floor(event.clientX - boardElementRect.left);
    const y = Math.floor(event.clientY - boardElementRect.top);
    return { x, y };
  }

  private getCell(position: Position): Cell {
    const col = Math.floor(position.x / this.cellSize);
    const row = Math.floor(position.y / this.cellSize);
    return { col, row };
  }
}
