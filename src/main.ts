import "./styles.scss";
import { OldBoard } from "./old.board";
import Board from "./board";
import * as Puzzles from "./puzzles";
import { Puzzle } from "./interfaces";
import BoardPreview from "./board-preview";

const boardContainer: HTMLElement = document.querySelector(".board-container");
const puzzleName: HTMLElement = document.querySelector(".puzzle-name");
const moveCount: HTMLElement = document.querySelector(".move-count");

const oldBoard = new OldBoard(Puzzles.daisy);
oldBoard.mount(".board-container");
console.log(oldBoard);

const board = new Board(Puzzles.daisy, {
  host: boardContainer,
  name: puzzleName,
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
    this.sets["level 1"].forEach((board: Puzzle) => {
      const container = document.createElement("div");
      container.classList.add("board-thumbnail");
      container.innerHTML = `
          <div class="preview"></div>
          <div class="board-name">${board.name}</div>
      `;
      document.querySelector(".set-content").insertAdjacentElement("beforeend", container);

      const b = new Board(Puzzles.daisy, {
        host: boardContainer,
        name: puzzleName,
        moveCount: moveCount,
      });
      if (!document.querySelector(".preview").innerHTML) b.attach(".preview");
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

Klotski.init();
