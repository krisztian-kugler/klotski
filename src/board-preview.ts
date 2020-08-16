import { BoardConfig } from "./interfaces";
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
  destructibles: Block[];
  walls: Block[];

  constructor(config: BoardConfig) {}
}
