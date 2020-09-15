import BaseBoard from "./base-board";
import CoverageMatrix from "./coverage-matrix";
import { MovableBlock, GateBlock } from "./entities";
import { Position, Cell, BoardConfig } from "./interfaces";
import { Axis, Direction } from "./enums";
import { isDifferentCell, isSameCell } from "./utils";

export default class MainBoard extends BaseBoard {
  private isPlaying = true;
  private coverageMatrix: CoverageMatrix;
  private cellFromPoint: Cell; // Cell at the current pointer position
  private activeBlock: MovableBlock; // The block that's currently being dragged
  private activeCell: Cell; // The cell of the active block at the current pointer position
  private moveFrom: Cell;
  private moveTo: Cell;
  private _dragging = false;

  set dragging(value: boolean) {
    this._dragging = value;
    document.body.style.cursor = this.dragging ? "pointer" : "default";
  }

  get dragging(): boolean {
    return this._dragging;
  }

  constructor(config: BoardConfig) {
    super(config);
    this.setupCoverageMatrix();
    this.addEventListeners();
  }

  addEventListeners() {
    this.canvas.addEventListener("pointerdown", this.dragStart);
    document.addEventListener("pointermove", this.dragMove);
    document.addEventListener("pointerup", this.dragEnd);
  }

  resize(cellSize: number) {
    this.cellSize = cellSize;
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;
    this.renderEntities();
  }

  reset() {
    this.isPlaying = true;
    this.moveHistory = [];
    this.moveCount = 0;
    this.coverageMatrix.reset();
    [this.master, ...this.movables, ...this.gates].forEach(block => block.reset());
    this.setupCoverageMatrix();
    this.renderEntities();
  }

  private setupCoverageMatrix() {
    if (!this.coverageMatrix) this.coverageMatrix = new CoverageMatrix(this.cols, this.rows);
    [this.master, ...this.movables, ...this.gates, ...this.walls].forEach(block => {
      this.coverageMatrix.setValues(block.cells, false);
    });
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

  private scanGates() {
    this.gates.forEach(gate => {
      if (!gate.unlocked) {
        console.log("scan gates");
        gate.lockDataMap.forEach(({ keyCells, unlocked }, cell) => {
          this.master.cells.forEach(masterCell => {
            if (!unlocked && keyCells.find(keyCell => isSameCell(keyCell, masterCell))) {
              gate.unlock(cell, this.context, this.cellSize);
            }
          });
        });
      }
    });
  }

  private checkWinCondition() {
    return this.master.cells.every(masterCell =>
      this.target.cells.some(targetCell => isSameCell(targetCell, masterCell))
    );
  }

  private dragStart = (event: PointerEvent) => {
    if (!this.isPlaying) return;
    event.preventDefault();
    this.cellFromPoint = this.getCell(this.getPosition(event));
    const block = this.getBlock(this.cellFromPoint);

    if (block instanceof MovableBlock) {
      this.dragging = true;
      this.activeCell = { ...this.cellFromPoint };
      this.activeBlock = block;
      this.moveFrom = { ...this.activeBlock.cells[0] };
      this.coverageMatrix.setValues(this.activeBlock.cells, true);
    }

    if (block instanceof GateBlock && block.unlocked) {
      block.destroy(this.context, this.cellSize);
      this.coverageMatrix.setValues(block.cells, true);
    }
  };

  private dragMove = (event: PointerEvent) => {
    if (this.dragging) {
      const cell = this.getCell(this.getPosition(event));

      if (isDifferentCell(cell, this.cellFromPoint)) {
        this.cellFromPoint = { ...cell };

        if (!this.activeCell && this.activeBlock.contains(this.cellFromPoint)) {
          this.activeCell = { ...this.cellFromPoint };
        }

        if (this.activeCell && isDifferentCell(this.activeCell, this.cellFromPoint)) {
          const axis = this.cellFromPoint.col !== this.activeCell.col ? Axis.COL : Axis.ROW;
          const direction = this.cellFromPoint[axis] > this.activeCell[axis] ? Direction.UP : Direction.DOWN;
          const canMove = this.coverageMatrix.isAccessible(
            this.activeBlock.cells.map(cell => ({ ...cell, [axis]: cell[axis] + direction }))
          );

          if (canMove) {
            this.activeBlock.destroy(this.context, this.cellSize);
            this.activeBlock.move(axis, direction);

            this.target.cells.forEach(targetCell => {
              if (
                this.coverageMatrix.getValue(targetCell.col, targetCell.row) &&
                this.activeBlock.cells.every(cell => isDifferentCell(cell, targetCell))
              ) {
                this.target.renderCell(targetCell, this.context, this.cellSize);
              }
            });

            this.activeBlock.render(this.context, this.cellSize);

            if (this.activeBlock.master) {
              if (this.checkWinCondition()) {
                console.log("you won!");
                this.dragEnd();
                this.isPlaying = false;
              } else {
                this.scanGates();
              }
            }

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

  private dragEnd = () => {
    if (this.dragging) {
      this.dragging = false;
      this.moveTo = { ...this.activeBlock.cells[0] };

      if (isDifferentCell(this.moveFrom, this.moveTo)) {
        this.moveHistory.push({ from: this.moveFrom, to: this.moveTo });
        this.moveCount = this.moveHistory.length;
      }

      this.coverageMatrix.setValues(this.activeBlock.cells, false);
      this.activeBlock = this.activeCell = this.moveFrom = this.moveTo = null;
    }
  };
}
