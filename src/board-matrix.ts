import { GridCell } from "./models";

export class BoardMatrix {
  private matrix: boolean[][];

  constructor(private rows: number, private columns: number) {
    this.init();
  }

  getValue(row: number, column: number): boolean {
    if (this.isWithinBounds(row, column)) {
      return this.matrix[row][column];
    } else {
      throw new Error("Cannot get value: invalid coordinates.");
    }
  }

  setValue(row: number, column: number, value: boolean) {
    if (this.isWithinBounds(row, column)) {
      this.matrix[row][column] = value;
    } else {
      throw new Error("Cannot set value: invalid coordinates.");
    }
  }

  setValues(cells: GridCell[], value: boolean) {
    cells.forEach(cell => this.setValue(cell.row, cell.column, value));
  }

  reset() {
    for (const row of this.matrix) {
      for (let column of row) {
        column = false;
      }
    }
  }

  private isWithinBounds(row: number, column: number): boolean {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns;
  }

  private init() {
    this.matrix = Array(this.rows)
      .fill([])
      .map(_ => Array(this.columns).fill(false));
  }
}
