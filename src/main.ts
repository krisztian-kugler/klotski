import "./styles.scss";
import { OldBoard } from "./old.board";
import Board from "./board";
import * as Puzzles from "./puzzles";
import { BoardConfig } from "./interfaces";
import BoardPreview from "./board-preview";

abstract class Klotski {
  static sets: any;

  static async init() {
    this.sets = await this.loadPuzzles("boards.json");

    const save = localStorage.getItem("klotski-save");

    if (save) {
      // display preview position
    } else {
      // show welcome message
    }

    this.renderPreviews();
  }

  static loadPuzzles(url: string): Promise<any> {
    return fetch(url)
      .then(response => response.json())
      .catch(console.log);
  }

  static renderPreviews() {
    this.sets["level 1"].forEach((board: BoardConfig) => {
      const boardPreview = new BoardPreview(board);
      console.log(boardPreview);
    });

    /* const template = `
      <div class="set-container">
        ${this.sets.map((set: any[]) => {
          return `
            <div>
              ${set.map((board: any) => {
                return `<klotski-canvas width=${board.cols} height=${board.rows}></klotski-canvas>`;
              })}
            </div>
          `;
        })}
      </div>
    `; */
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
