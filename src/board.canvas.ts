import { Position, Cell, BoardConfig } from "./models";
import CoverageMatrix from "./coverage-matrix";

export default class Board {
  boardElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  coverageMatrix: CoverageMatrix;
  cols: number;
  rows: number;
  cellSize: number = 30;
  private _hoveredCell: Cell;

  set hoveredCell(value: Cell) {
    this._hoveredCell = value;
    console.log(this.hoveredCell);
    this.context.fillRect(
      this.hoveredCell.col * this.cellSize,
      this.hoveredCell.row * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  get hoveredCell(): Cell {
    return this._hoveredCell;
  }

  constructor(config: BoardConfig) {
    this.cols = config.columns;
    this.rows = config.rows;
    this.createBoard();
  }

  attach(selector: string) {
    const host = document.querySelector(selector);
    if (host) {
      host.append(this.boardElement);
    } else {
      throw new Error(`Board cannot be attached to '${selector}'. Element doesn't exist.`);
    }
    this.boardElement.addEventListener("pointermove", this.onPointerMove);
  }

  private onPointerDown = (event: PointerEvent) => {};

  private onPointerUp = (event: PointerEvent) => {};

  private onPointerMove = (event: PointerEvent) => {
    const position = this.getPosition(event);
    const cell = this.getCell(position);
    if (!this.hoveredCell) this.hoveredCell = cell;
    const isDifferent = Object.keys(cell).some((key: "col" | "row") => cell[key] !== this.hoveredCell[key]);
    if (isDifferent) this.hoveredCell = cell;
  };

  private createBoard() {
    this.boardElement = document.createElement("canvas");
    this.boardElement.classList.add("canvas");
    this.boardElement.width = this.cols * this.cellSize;
    this.boardElement.height = this.rows * this.cellSize;
    this.context = this.boardElement.getContext("2d");
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
