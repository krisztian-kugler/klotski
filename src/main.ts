import "./styles.scss";
import BaseBoard from "./base-board";
import MainBoard from "./board";
import { Puzzle, PuzzleCollection } from "./interfaces";

const boardContainer: HTMLElement = document.querySelector(".board-container");
const puzzleName: HTMLElement = document.querySelector(".puzzle-name");
const moveCount: HTMLElement = document.querySelector(".move-count");

abstract class Klotski {
  private static sets: PuzzleCollection;
  private static mainBoardCellSize = 30;
  private static previewBoardCellSize = 10;
  static mainBoard: MainBoard;

  static async init() {
    this.sets = await this.loadPuzzles("boards.json");
    const save = localStorage.getItem("klotski-save");
    save ? this.renderSavedPosition() : this.renderWelcomeMessage();
    this.renderPreviews();
  }

  private static loadPuzzles(url: string): Promise<PuzzleCollection> {
    return fetch(url)
      .then(response => response.json())
      .catch(console.log);
  }

  private static renderSavedPosition() {}

  private static renderWelcomeMessage() {}

  private static renderPreviews() {
    this.sets["level 1"].forEach(puzzle => {
      const container = document.createElement("div");
      container.classList.add("board-thumbnail");
      container.innerHTML = `
          <div class="preview"></div>
          <div class="board-name">${puzzle.name}</div>
      `;
      document.querySelector(".set-content").insertAdjacentElement("beforeend", container);
      const previewElement = container.querySelector(".preview") as HTMLElement;

      new BaseBoard({
        puzzle,
        hostElement: previewElement,
        nameElement: puzzleName,
      });

      container.addEventListener("click", () => {
        boardContainer.innerHTML = "";
        this.mainBoard = new MainBoard({
          puzzle,
          cellSize: 40,
          hostElement: boardContainer,
          nameElement: puzzleName,
          moveCountElement: moveCount,
        });
        document.querySelector(".home-screen").classList.toggle("hidden");
      });
    });
  }

  private static calcCellSize(): number {
    return 50;
  }
}

document.querySelector(".header").addEventListener("click", function () {
  document.querySelector(".home-screen").classList.toggle("hidden");
});

document.querySelector(".reset").addEventListener("click", (event: PointerEvent) => {
  event.stopPropagation();
  Klotski.mainBoard.reset();
});

Klotski.init();
