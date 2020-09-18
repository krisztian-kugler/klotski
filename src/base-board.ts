import { Target, MovableBlock, WallBlock, GateBlock, Block } from "./entities";
import { BoardConfig, Cell, MoveHistoryEntry, Puzzle } from "./interfaces";
import { Colors, Axis, Direction } from "./enums";
import { isSameCell } from "./utils";

export default class BaseBoard {
  protected puzzle: Puzzle;
  protected cellSize: number;
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
  private _moveCount = 0;

  protected set moveCount(value: number) {
    this._moveCount = value;
    if (this.config.moveCountElement) this.config.moveCountElement.innerText = this.moveCount.toString();
  }

  protected get moveCount(): number {
    return this._moveCount;
  }

  constructor(protected config: BoardConfig) {
    this.puzzle = JSON.parse(JSON.stringify(config.puzzle));
    if (this.config.nameElement) this.config.nameElement.innerText = config.puzzle.name;
    this.moveCount = 0;
    this.cols = config.puzzle.cols;
    this.rows = config.puzzle.rows;
    this.cellSize = config.cellSize || 15;
    this.createBoard();
    this.createEntities();
    if (config.moveHistory?.length) {
      this.moveHistory = config.moveHistory;
      this.replay();
    }
    this.renderEntities();
    this.attachBoard();
  }

  protected createBoard() {
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("canvas");
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;
    this.context = this.canvas.getContext("2d");
  }

  protected createEntities() {
    this.target = new Target(this.puzzle.target, this.canvas);
    this.master = new MovableBlock(this.puzzle.master, this.canvas, true);
    this.movables = this.puzzle.movables?.map(cells => new MovableBlock(cells, this.canvas));
    this.gates = this.puzzle.gates?.map(cells => new GateBlock(cells, this.canvas));
    this.walls = this.puzzle.walls?.map(cells => new WallBlock(cells, this.canvas));
  }

  protected replay() {
    this.moveHistory.forEach(entry => {
      const block = this.getBlock(entry.from) as MovableBlock;
      const colOffset = entry.to.col - entry.from.col;
      const rowOffset = entry.to.row - entry.from.row;

      if (colOffset !== 0) {
        const direction = colOffset > 0 ? Direction.UP : Direction.DOWN;
        block.move(Axis.COL, direction, Math.abs(colOffset));
      }

      if (rowOffset !== 0) {
        const direction = rowOffset > 0 ? Direction.UP : Direction.DOWN;
        block.move(Axis.ROW, direction, Math.abs(rowOffset));
      }
    });
    this.moveCount = this.moveHistory.length;
  }

  protected renderEntities() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.target.render(this.context, this.cellSize);
    this.master.render(this.context, this.cellSize);
    this.movables.forEach(movable => movable.render(this.context, this.cellSize));
    this.gates.forEach(destructible => destructible.render(this.context, this.cellSize, Colors.DESTRUCTIBLE));
    this.walls.forEach(wall => wall.render(this.context, this.cellSize, Colors.WALL));
  }

  protected attachBoard() {
    this.config.hostElement.append(this.canvas);
  }

  protected getBlock(cell: Cell): Block {
    return [this.master, ...this.movables, ...this.gates, ...this.walls].find(block =>
      block.cells.find(c => isSameCell(c, cell))
    );
  }
}
