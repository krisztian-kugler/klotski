import { GateBlock, MovableBlock, Target, WallBlock } from "./entities";
import { BoardConfig } from "./interfaces";

export default class BaseBoard {
  protected cellSize = 10;
  protected cols: number;
  protected rows: number;
  protected canvas: HTMLCanvasElement;
  protected target: Target;
  protected master: MovableBlock;
  protected movables: MovableBlock[] = [];
  protected walls: WallBlock[] = [];
  protected gates: GateBlock[] = [];

  constructor(config: BoardConfig) {
    this.cols = config.puzzle.cols;
    this.rows = config.puzzle.rows;
    this.cellSize = config.cellSize || 10;
  }

  protected init() {}
}
