import { Cell } from "./interfaces";

export default class CoverageMatrix {
  private matrix: boolean[][];

  constructor(private cols: number, private rows: number) {
    this.create();
  }

  getValue(col: number, row: number): boolean {
    if (this.isWithinBounds(col, row)) {
      return this.matrix[row][col];
    } else {
      throw new Error(`Cannot get value for 'col: ${col}, row: ${row}': invalid coordinates.`);
    }
  }

  setValue(col: number, row: number, value: boolean) {
    if (this.isWithinBounds(col, row)) {
      this.matrix[row][col] = value;
    } else {
      throw new Error(`Cannot set value for 'col: ${col}, row: ${row}': invalid coordinates.`);
    }
  }

  isAccessible(cells: Cell[]): boolean {
    return cells.every(cell => this.getValue(cell.col, cell.row));
  }

  reset() {
    for (const row of this.matrix) {
      for (let col of row) {
        col = true;
      }
    }
  }

  private isWithinBounds(col: number, row: number): boolean {
    return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
  }

  private create() {
    this.matrix = Array(this.rows)
      .fill([])
      .map(_ => Array(this.cols).fill(true));
  }
}
