import { Puzzle } from "./interfaces";
import { Target, Block } from "./entities";

export default class BoardPreview {
  cellSize = 10;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private cols: number;
  private rows: number;
  private target: Target;
  private master: Block;
  private movables: Block[];
  private gates: Block[];
  private walls: Block[];

  constructor(puzzle: Puzzle) {}

  private createBoard() {
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("canvas");
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;
    this.context = this.canvas.getContext("2d");
  }
}
