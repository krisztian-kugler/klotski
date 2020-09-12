import { Cell, Render, BorderDescriptor, Destroy, Reset, Move, Unlock, CellLockState } from "./interfaces";
import { Axis, Direction } from "./enums";

export class Entity {
  constructor(public cells: Cell[]) {}
}

export class Target extends Entity implements Render {
  constructor(cells: Cell[]) {
    super(cells);
  }

  render(context: CanvasRenderingContext2D, cellSize: number, color: string) {
    context.fillStyle = color;
    this.cells.forEach(cell =>
      context.fillRect(cell.col * cellSize + 2, cell.row * cellSize + 2, cellSize - 4, cellSize - 4)
    );
  }
}

export class Block extends Entity implements Render {
  protected borders = new Map<Cell, BorderDescriptor>();

  constructor(cells: Cell[]) {
    super(cells);
    this.setBorders();
  }

  contains(cell: Cell): boolean {
    return !!this.cells.find(c => c.col === cell.col && c.row === cell.row);
  }

  render(context: CanvasRenderingContext2D, cellSize: number, color: string) {
    context.fillStyle = color;
    this.cells.forEach(cell => {
      context.fillRect(cell.col * cellSize + 2, cell.row * cellSize + 2, cellSize - 4, cellSize - 4);
      const border = this.borders.get(cell);
      if (border.top) context.fillRect(cell.col * cellSize + 2, cell.row * cellSize, cellSize - 4, 2);
      if (border.bottom) context.fillRect(cell.col * cellSize + 2, cell.row * cellSize + cellSize - 2, cellSize - 4, 2);
      if (border.left) context.fillRect(cell.col * cellSize, cell.row * cellSize + 2, 2, cellSize - 4);
      if (border.right) context.fillRect(cell.col * cellSize + cellSize - 2, cell.row * cellSize + 2, 2, cellSize - 4);
      if (border.topLeft) context.fillRect(cell.col * cellSize, cell.row * cellSize, 2, 2);
      if (border.topRight) context.fillRect(cell.col * cellSize + cellSize - 2, cell.row * cellSize, 2, 2);
      if (border.bottomLeft) context.fillRect(cell.col * cellSize, cell.row * cellSize + cellSize - 2, 2, 2);
      if (border.bottomRight)
        context.fillRect(cell.col * cellSize + cellSize - 2, cell.row * cellSize + cellSize - 2, 2, 2);
    });
  }

  protected setBorders() {
    this.cells.forEach(cell => {
      const top = !!this.cells.find(c => c.col === cell.col && c.row === cell.row - 1);
      const bottom = !!this.cells.find(c => c.col === cell.col && c.row === cell.row + 1);
      const left = !!this.cells.find(c => c.col === cell.col - 1 && c.row === cell.row);
      const right = !!this.cells.find(c => c.col === cell.col + 1 && c.row === cell.row);
      const topLeft = top && left && !!this.cells.find(c => c.col === cell.col - 1 && c.row === cell.row - 1);
      const topRight = top && right && !!this.cells.find(c => c.col === cell.col + 1 && c.row === cell.row - 1);
      const bottomLeft = bottom && left && !!this.cells.find(c => c.col === cell.col - 1 && c.row === cell.row + 1);
      const bottomRight = bottom && right && !!this.cells.find(c => c.col === cell.col + 1 && c.row === cell.row + 1);
      this.borders.set(cell, { top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight });
    });
  }
}

export class MovableBlock extends Block implements Move, Destroy, Reset {
  startCells: Cell[];

  constructor(cells: Cell[], public master = false) {
    super(cells);
    this.startCells = this.cloneCells(this.cells);
  }

  move(axis: Axis, direction: Direction, amount = 1) {
    this.cells.forEach(cell => (cell[axis] += direction * amount));
  }

  destroy(context: CanvasRenderingContext2D, cellSize: number) {
    this.cells.forEach(cell => context.clearRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize));
  }

  reset() {
    this.cells = this.cloneCells(this.startCells);
    this.borders.clear();
    this.setBorders();
  }

  private cloneCells(source: Cell[]) {
    return source.map(cell => ({ ...cell }));
  }
}

export class GateBlock extends Block implements Unlock, Destroy, Reset {
  lockState: Map<Cell, boolean>;
  unlocked = false;
  unlockZones: Map<Cell, CellLockState> = new Map();

  constructor(cells: Cell[]) {
    super(cells);
    this.lockState = new Map(this.cells.map(cell => [cell, false]));
    this.calcUnlockZones();
  }

  unlock(cell: Cell, context: CanvasRenderingContext2D, cellSize: number) {
    this.lockState.set(cell, true);
    this.unlockZones.get(cell).unlocked = true;
    context.clearRect(cell.col * cellSize + 2, cell.row * cellSize + 2, cellSize - 4, cellSize - 4);
    if (Array.from(this.lockState).every(([_, value]) => value)) this.unlocked = true;
  }

  destroy(context: CanvasRenderingContext2D, cellSize: number) {
    this.cells.forEach(cell => context.clearRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize));
  }

  reset() {
    this.unlocked = false;
    this.lockState.forEach(value => (value = false));
    this.unlockZones.forEach(cellLockState => (cellLockState.unlocked = false));
  }

  private calcUnlockZones() {
    this.borders.forEach(({ top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight }, cell) => {
      const unlockCells: Cell[] = [];
      if (!top) unlockCells.push({ col: cell.col, row: cell.row - 1 });
      if (!bottom) unlockCells.push({ col: cell.col, row: cell.row + 1 });
      if (!left) unlockCells.push({ col: cell.col - 1, row: cell.row });
      if (!right) unlockCells.push({ col: cell.col + 1, row: cell.row });
      if (top && left && !topLeft) unlockCells.push({ col: cell.col - 1, row: cell.row - 1 });
      if (top && right && !topRight) unlockCells.push({ col: cell.col + 1, row: cell.row - 1 });
      if (bottom && left && !bottomLeft) unlockCells.push({ col: cell.col - 1, row: cell.row + 1 });
      if (bottom && right && !bottomRight) unlockCells.push({ col: cell.col + 1, row: cell.row + 1 });
      this.unlockZones.set(cell, { unlocked: false, unlockCells: unlockCells });
    });

    /* this.cells.forEach(cell => {
      const unlockZones: Cell[] = [];
      const top = !this.cells.find(c => c.col === cell.col && c.row === cell.row - 1);
      const bottom = !this.cells.find(c => c.col === cell.col && c.row === cell.row + 1);
      const left = !this.cells.find(c => c.col === cell.col - 1 && c.row === cell.row);
      const right = !this.cells.find(c => c.col === cell.col + 1 && c.row === cell.row);
      const topLeft = !top && !left && !this.cells.find(c => c.col === cell.col - 1 && c.row === cell.row - 1);
      const topRight = !top && !right && !this.cells.find(c => c.col === cell.col + 1 && c.row === cell.row - 1);
      const bottomLeft = !bottom && !left && !this.cells.find(c => c.col === cell.col - 1 && c.row === cell.row + 1);
      const bottomRight = !bottom && !right && !this.cells.find(c => c.col === cell.col + 1 && c.row === cell.row + 1);

      if (top) unlockZones.push({ col: cell.col, row: cell.row - 1 });
      if (bottom) unlockZones.push({ col: cell.col, row: cell.row + 1 });
      if (left) unlockZones.push({ col: cell.col - 1, row: cell.row });
      if (right) unlockZones.push({ col: cell.col + 1, row: cell.row });
      if (topLeft) unlockZones.push({ col: cell.col - 1, row: cell.row - 1 });
      if (topRight) unlockZones.push({ col: cell.col + 1, row: cell.row - 1 });
      if (bottomLeft) unlockZones.push({ col: cell.col - 1, row: cell.row + 1 });
      if (bottomRight) unlockZones.push({ col: cell.col + 1, row: cell.row + 1 });

      this.unlockZones.set(cell, { unlocked: false, unlockCells: unlockZones });
    }); */

    console.dir(this.unlockZones);
  }
}
