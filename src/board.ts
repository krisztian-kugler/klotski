import { Position, Cell, BoardConfig } from "./interfaces";
import { Colors, Axis, Direction } from "./enums";
import { Target, Block, MovableBlock, DestructibleBlock } from "./entities";
import CoverageMatrix from "./coverage-matrix";

export default class Board {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  coverageMatrix: CoverageMatrix;
  cols: number;
  rows: number;
  cellSize = 30;
  moveCount = 0;
  target: Target;
  master: MovableBlock;
  movables: MovableBlock[];
  destructibles: DestructibleBlock[];
  walls: Block[];

  private cellFromPoint: Cell; // Cell at the current pointer position
  private activeBlock: MovableBlock; // The block that's currently being dragged
  private activeCell: Cell; // The cell of the active block at the current pointer position
  private _dragging = false;

  set dragging(value: boolean) {
    this._dragging = value;
    document.body.style.cursor = this.dragging ? "pointer" : "default";
  }

  get dragging(): boolean {
    return this._dragging;
  }

  constructor(config: BoardConfig) {
    this.cols = config.cols;
    this.rows = config.rows;
    this.coverageMatrix = new CoverageMatrix(this.cols, this.rows);
    this.createBoard();
  }

  attach(selector: string) {
    const host = document.querySelector(selector);
    if (host) {
      host.append(this.canvas);
      this.canvas.addEventListener("pointerdown", this.onPointerDown);
      document.addEventListener("pointermove", this.onPointerMove);
      document.addEventListener("pointerup", this.onPointerUp);
    } else {
      throw new Error(`Board cannot be attached to '${selector}'. Element doesn't exist.`);
    }
  }

  resize(cellSize: number) {
    this.cellSize = cellSize;
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderEntities();
  }

  reset() {
    this.moveCount = 0;
    this.coverageMatrix.reset();
  }

  private createBoard() {
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("canvas");
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;
    this.context = this.canvas.getContext("2d");
  }

  private createEntities(config: BoardConfig) {
    this.target = new Target(config.target);
    this.master = new MovableBlock(config.master, true);
    this.movables = config.movables?.map(cells => new MovableBlock(cells));
    this.destructibles = config.destructibles?.map(cells => new DestructibleBlock(cells));
    this.walls = config.walls?.map(cells => new Block(cells));
  }

  private renderEntities() {
    this.target.render(this.context, this.cellSize, Colors.TARGET);
    this.master.render(this.context, this.cellSize, Colors.MASTER);
    this.movables.forEach(movable => movable.render(this.context, this.cellSize, Colors.MOVABLE));
    this.destructibles.forEach(destructible => destructible.render(this.context, this.cellSize, Colors.DESTRUCTIBLE));
    this.walls.forEach(wall => wall.render(this.context, this.cellSize, Colors.WALL));
  }

  private getPosition(event: PointerEvent): Position {
    const canvasRect = this.canvas.getBoundingClientRect();
    const x = Math.floor(event.clientX - canvasRect.left);
    const y = Math.floor(event.clientY - canvasRect.top);
    return { x, y };
  }

  private getCell(position: Position): Cell {
    const col = Math.floor(position.x / this.cellSize);
    const row = Math.floor(position.y / this.cellSize);
    return { col, row };
  }

  private getBlock(cell: Cell): Block {
    return [this.master, ...this.movables, ...this.destructibles, ...this.walls].find(block =>
      block.cells.find(c => c.col === cell.col && c.row === cell.row)
    );
  }

  private onPointerDown = (event: PointerEvent) => {
    event.preventDefault();
    this.cellFromPoint = this.getCell(this.getPosition(event));
    const block = this.getBlock(this.cellFromPoint);

    if (block instanceof MovableBlock) {
      this.dragging = true;
      this.activeCell = { ...this.cellFromPoint };
      this.activeBlock = block;
      this.coverageMatrix.setValues(this.activeBlock.cells, true);
    }

    if (block instanceof DestructibleBlock && block.unlocked) {
      block.destroy(this.context, this.cellSize);
      this.coverageMatrix.setValues(block.cells, true);
    }
  };

  private onPointerMove = (event: PointerEvent) => {
    if (this.dragging) {
      const cell = this.getCell(this.getPosition(event));

      if (cell.col !== this.cellFromPoint.col || cell.row !== this.cellFromPoint.row) {
        this.cellFromPoint = { ...cell };

        if (!this.activeCell && this.activeBlock.contains(this.cellFromPoint)) {
          this.activeCell = { ...this.cellFromPoint };
        }

        if (
          this.activeCell &&
          (this.activeCell.col !== this.cellFromPoint.col || this.activeCell.row !== this.cellFromPoint.row)
        ) {
          const axis = this.cellFromPoint.col !== this.activeCell.col ? Axis.COL : Axis.ROW;
          const direction = this.cellFromPoint[axis] > this.activeCell[axis] ? Direction.UP : Direction.DOWN;
          const canMove = this.coverageMatrix.isAccessible(
            this.activeBlock.cells.map(cell => ({ ...cell, [axis]: cell[axis] + direction }))
          );

          if (canMove) {
            this.activeBlock.cells.forEach(c => {
              this.context.clearRect(c.col * this.cellSize, c.row * this.cellSize, this.cellSize, this.cellSize);
            });
            this.activeBlock.move(axis, direction);
            this.activeBlock.render(
              this.context,
              this.cellSize,
              this.activeBlock.master ? Colors.MASTER : Colors.MOVABLE
            );
            this.activeCell = { ...this.cellFromPoint };
          } else if (this.activeBlock.contains(this.cellFromPoint)) {
            this.activeCell = { ...this.cellFromPoint };
          } else {
            this.activeCell = null;
          }
        }
      }
    }
  };

  private onPointerUp = () => {
    if (this.dragging) {
      this.dragging = false;
      this.coverageMatrix.setValues(this.activeBlock.cells, false);
      this.activeBlock = this.activeCell = null;
    }
  };
}
