import { Cell, Render, BorderDescriptor, Movable, Destructible } from "./interfaces";
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
  private borders = new Map<Cell, BorderDescriptor>();

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

  private setBorders() {
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

export class MovableBlock extends Block implements Movable {
  startCells: Cell[];

  constructor(cells: Cell[], public master = false) {
    super(cells);
    this.cloneCells(this.startCells, this.cells);
  }

  move(axis: Axis, direction: Direction) {
    this.cells.forEach(cell => (cell[axis] += direction));
  }

  reset() {
    this.cloneCells(this.cells, this.startCells);
  }

  private cloneCells(target: Cell[], source: Cell[]) {
    target = source.map(cell => ({ ...cell }));
  }
}

export class DestructibleBlock extends Block implements Destructible {
  lockState: Map<Cell, boolean>;
  unlocked = false;

  constructor(cells: Cell[]) {
    super(cells);
    this.lockState = new Map(this.cells.map(cell => [cell, false]));
  }

  unlock(cell: Cell) {
    this.lockState.set(cell, true);
    if (Array.from(this.lockState).every(([_, value]) => value)) this.unlocked = true;
  }

  destroy(context: CanvasRenderingContext2D, cellSize: number) {
    this.cells.forEach(cell => context.clearRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize));
  }
}
