import { GateBlock, MovableBlock, Target, WallBlock } from "./entities";
import { BoardConfig, MoveHistoryEntry, Puzzle } from "./interfaces";

export default class BaseBoard {
  protected cellSize = 10;
  protected cols: number;
  protected rows: number;
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;
  protected target: Target;
  protected master: MovableBlock;
  protected movables: MovableBlock[] = [];
  protected walls: WallBlock[] = [];
  protected gates: GateBlock[] = [];
  protected moveHistory: MoveHistoryEntry[] = [];
  protected name: string;
  protected puzzle: Puzzle;
  protected entities = {
    target: <Target>null,
    movables: <MovableBlock[]>[],
    walls: <WallBlock[]>[],
    gates: <GateBlock[]>[],
  };

  constructor(protected config: BoardConfig) {
    this.cols = config.puzzle.cols;
    this.rows = config.puzzle.rows;
    this.cellSize = config.cellSize || 10;
  }

  protected createBoard() {
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("canvas");
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;
    this.context = this.canvas.getContext("2d");
  }
}
