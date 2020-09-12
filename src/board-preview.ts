import { Puzzle } from "./interfaces";
import { Target, Block } from "./entities";

export default class BoardPreview {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  cols: number;
  rows: number;
  cellSize = 10;
  target: Target;
  master: Block;
  movables: Block[];
  gates: Block[];
  walls: Block[];

  constructor(config: Puzzle) {}
}
