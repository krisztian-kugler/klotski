import { BoardConfig, GridCell } from "./models";
import { Entity, Block, Wall, Gate, Target } from "./entities";
import { BoardMatrix } from "./board-matrix";
import { validateBoard } from "./validity-checker";
import { toZeroBased } from "./utils";

const unit = 30;

type GridAxis = "gridRowStart" | "gridColumnStart";

export class Board {
  element: HTMLDivElement;
  matrix: BoardMatrix;
  moveCount = 0;
  unit: number;
  rows: number;
  columns: number;
  target: Target;
  masterBlock: Block;
  blocks: Block[] = [];
  walls: Wall[] = [];
  gates: Gate[] = [];

  private activeBlock: Block;
  private activeElement: Element;
  private _dragging = false;

  set dragging(value: boolean) {
    this._dragging = value;
    document.body.style.cursor = this.dragging ? "pointer" : "default";
  }

  get dragging(): boolean {
    return this._dragging;
  }

  constructor(config: BoardConfig) {
    validateBoard(config);
    this.rows = config.rows;
    this.columns = config.columns;

    this.target = this.createEntity(Target, config.target);
    this.masterBlock = this.createEntity(Block, config.masterBlock, true);
    if (config.blocks) this.blocks = config.blocks.map(cells => this.createEntity(Block, cells));
    if (config.walls) this.walls = config.walls.map(cells => this.createEntity(Wall, cells));
    if (config.gates) this.gates = config.gates.map(cells => this.createEntity(Gate, cells));

    this.init();

    this.matrix = new BoardMatrix(this.rows, this.columns);
    this.updateMatrix([this.masterBlock, ...this.blocks, ...this.walls, ...this.gates], true);

    this.element.addEventListener("mousedown", this.dragStart);
    document.addEventListener("mousemove", this.dragMove);
    document.addEventListener("mouseup", this.dragEnd);
  }

  private generateId = (() => {
    let counter = 0;
    return () => counter++;
  })();

  private createEntity(entity: new (...args: any[]) => Entity, cells: GridCell[], ...args: any[]): any {
    return new entity(cells, this.generateId(), ...args);
  }

  private dragStart = (event: MouseEvent) => {
    event.preventDefault();
    const element = event.target as HTMLElement;
    if (element.hasAttribute("draggable")) {
      this.dragging = true;
      this.activeElement = element;
      this.activeBlock = [this.masterBlock, ...this.blocks].find(
        block => block.id === +element.getAttribute("entity-id")
      );
      this.updateMatrix([this.activeBlock], false);
    }

    if (element.classList.contains("gate")) {
      const gate = this.gates.find(gate => gate.id === +element.getAttribute("entity-id"));
      if (gate.unlocked) {
        gate.open();
        this.updateMatrix([gate], false);
      }
    }
  };

  private dragMove = (event: MouseEvent) => {
    if (!this.dragging) return;

    const { clientX, clientY } = event;
    const elementBelow = document.elementFromPoint(clientX, clientY) as HTMLElement;

    if (!this.activeElement && this.activeBlock.elements.includes(elementBelow)) this.activeElement = elementBelow;

    if (this.activeElement && this.activeElement !== elementBelow) {
      const { top, bottom, left, right } = this.activeElement.getBoundingClientRect();

      if (clientY < top) this.moveHandler(elementBelow, "gridRowStart", -1);
      if (clientY > bottom) this.moveHandler(elementBelow, "gridRowStart", 1);
      if (clientX < left) this.moveHandler(elementBelow, "gridColumnStart", -1);
      if (clientX > right) this.moveHandler(elementBelow, "gridColumnStart", 1);
    }
  };

  private dragEnd = () => {
    if (!this.dragging) return;
    this.dragging = false;
    this.updateMatrix([this.activeBlock], true);
    this.activeBlock = this.activeElement = null;
  };

  private canMove(block: Block, axis: GridAxis, direction: 1 | -1): boolean {
    return block.elements
      .map(element => ({
        row: toZeroBased(element.style.gridRowStart) + (axis === "gridRowStart" ? direction : 0),
        column: toZeroBased(element.style.gridColumnStart) + (axis === "gridColumnStart" ? direction : 0),
      }))
      .every(
        cell =>
          cell.row >= 0 &&
          cell.row <= this.rows - 1 &&
          cell.column >= 0 &&
          cell.column <= this.columns - 1 &&
          !this.matrix.getValue(cell.row, cell.column)
      );
  }

  private moveBlock(block: Block, axis: GridAxis, direction: -1 | 1) {
    block.elements.forEach(element => (element.style[axis] = (parseInt(element.style[axis]) + direction).toString()));
  }

  private moveHandler(elementBelow: HTMLElement, axis: GridAxis, direction: -1 | 1) {
    if (this.canMove(this.activeBlock, axis, direction)) {
      this.moveBlock(this.activeBlock, axis, direction);
      if (this.activeBlock === this.masterBlock) {
        console.log(this.checkWinCondition());
        this.gateUnlocker();
      }
    } else if (this.activeBlock.elements.includes(elementBelow)) {
      this.activeElement = elementBelow;
    } else {
      this.activeElement = null;
    }
  }

  private gateUnlocker() {
    for (const element of this.masterBlock.elements) {
      const row = +element.style.gridRowStart;
      const column = +element.style.gridColumnStart;

      for (const gate of this.gates) {
        for (const cell of gate.cells) {
          if (
            (cell.row === row && cell.column === column - 1) ||
            (cell.row === row && cell.column === column + 1) ||
            (cell.column === column && cell.row === row - 1) ||
            (cell.column === column && cell.row === row + 1)
          ) {
            gate.unlockElement(cell);
          }
        }
      }
    }
  }

  private checkWinCondition(): boolean {
    if (this.activeBlock.master) {
      return this.target.cells.every(cell =>
        this.activeBlock.elements.some(
          element => cell.row === +element.style.gridRowStart && cell.column === +element.style.gridColumnStart
        )
      );
    } else return false;
  }

  private updateMatrix(entities: Entity[], value: boolean) {
    for (const entity of entities) {
      for (const element of entity.elements) {
        const row = toZeroBased(element.style.gridRowStart);
        const column = toZeroBased(element.style.gridColumnStart);
        this.matrix.setValue(row, column, value);
      }
    }
  }

  private init() {
    this.createBoard();

    for (const entity of [this.target, this.masterBlock, ...this.blocks, ...this.walls, ...this.gates]) {
      for (const element of entity.elements) {
        this.element.append(element);
      }
    }
  }

  private createBoard() {
    this.element = document.createElement("div");
    this.element.classList.add("board");
    this.element.style.gridTemplate = `repeat(${this.rows}, ${unit}px) / repeat(${this.columns}, ${unit}px)`;
  }

  mount(selector: string) {
    const host = document.querySelector(selector);
    if (host) {
      host.append(this.element);
    } else {
      throw new Error(`Board cannot be mounted on '${selector}'. Element doesn't exist.`);
    }
  }

  resize(unit: number) {
    this.element.style.gridTemplate = `repeat(${this.rows}, ${unit}px) / repeat(${this.columns}, ${unit}px)`;
  }

  reset() {
    this.matrix.reset();
    this.moveCount = 0;
  }

  destroy() {
    this.element.removeEventListener("mousedown", this.dragStart);
    document.removeEventListener("mousemove", this.dragMove);
    document.removeEventListener("mouseup", this.dragEnd);
  }
}
