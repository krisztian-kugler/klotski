import "./styles.scss";
import { OldBoard } from "./old.board";
import Board from "./board";
import * as Puzzles from "./puzzles";

abstract class Klotski {
  static sets: any;

  static async init() {
    const sets = await this.loadPuzzles("boards.json");
    console.log(sets);

    const save = localStorage.getItem("klotski-save");

    if (save) {
      // display preview position
    } else {
      // show welcome message
    }
  }

  static loadPuzzles(url: string) {
    return fetch(url)
      .then(data => data.json())
      .then(sets => (this.sets = sets))
      .catch(console.log);
  }
}

const boardContainer: HTMLElement = document.querySelector(".board-container");
const puzzleTitle: HTMLElement = document.querySelector(".puzzle-name");
const moveCount: HTMLElement = document.querySelector(".move-count");

const oldBoard = new OldBoard(Puzzles.daisy);
oldBoard.mount(".board-container");
console.log(oldBoard);

const board = new Board(Puzzles.daisy, {
  host: boardContainer,
  name: puzzleTitle,
  moveCount: moveCount,
});
board.attach(".board-container");
console.log(board);

document.querySelector(".header").addEventListener("click", function () {
  document.querySelector(".home-screen").classList.toggle("hidden");
});

document.querySelector(".reset").addEventListener("click", (event: PointerEvent) => {
  event.stopPropagation();
  board.reset();
});

Klotski.init();
