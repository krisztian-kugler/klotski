import { MoveHistoryEntry } from "./interfaces";

export default class MoveHistory {
  private history: MoveHistoryEntry[] = [];
  moveCount = 0;

  add(entry: MoveHistoryEntry) {
    this.history.push(entry);
    this.moveCount = this.history.length;
  }

  reset() {
    this.history = [];
    this.moveCount = 0;
  }
}
