import "./styles.scss";
import BaseBoard from "./base-board";
import MainBoard from "./board";
import { PuzzleCollection, SaveData } from "./interfaces";
import { Language } from "./enums";

const menuItems = [
  {
    label: "New Game",
    description: "Select a puzzle and start a new game",
  },
  {
    label: "Continue",
    description: "Pick up where you left off",
  },
  {
    label: "Settings",
    description: "Change theme, language and sound settings",
  },
  {
    label: "Tutorial",
    description: "Learn how to play Klotski",
  },
  {
    label: "GitHub",
    description: "Go to the GitHub repository of this project",
  },
];

const boardContainer: HTMLElement = document.querySelector(".board-container");
const puzzleName: HTMLElement = document.querySelector(".puzzle-name");
const moveCount: HTMLElement = document.querySelector(".move-count");

abstract class Klotski {
  private static sets: PuzzleCollection;
  private static translations: any;
  static mainBoard: MainBoard;
  static language: Language;

  static changeLanguage(language: Language = Language.ENGLISH) {
    this.language = language;
    console.log(this.translations);
    this.updateMenuItems(this.language);
  }

  private static updateMenuItems(language: Language) {
    document.querySelectorAll(".menu-item").forEach((item, i) => {
      item.innerHTML = `<span class="menu-item__label">${this.translations[language].menuItems[i].label}</span>
      <span class="menu-item__description">${this.translations[language].menuItems[i].description}</span>`;
    });
  }

  private static loadTranslations() {
    return fetch("translations.json")
      .then(response => response.json())
      .catch(console.log);
  }

  static renderMenu(items: { label: string; description: string; id?: string }[]) {
    document.querySelector(".menu").innerHTML = items.reduce(
      (acc, item) =>
        (acc += `
          <li class="menu-item">
            <span class="menu-item__label ${item.id === "continue" ? "disabled" : ""}">${item.label}</span>
            <span class="menu-item__description">${item.description}</span>
          </li>
        `),
      ""
    );
  }

  static async init() {
    this.translations = await this.loadTranslations();
    this.renderMenu(this.translations[Language.ENGLISH].menuItems);
    this.sets = await this.loadPuzzles("boards.json");
    const save = localStorage.getItem("klotski-save");
    save ? this.renderSavedPosition(save) : this.renderWelcomeMessage();
    this.renderPreviews();
  }

  private static loadPuzzles(url: string): Promise<PuzzleCollection> {
    return fetch(url)
      .then(response => response.json())
      .catch(console.log);
  }

  private static renderSavedPosition(saveData: string) {
    const save = JSON.parse(saveData) as SaveData;
    const puzzle = this.sets["level 1"].find(puzzle => puzzle.name === save.name);
    console.log(save.moveHistory);
    const container = document.createElement("div");
    container.classList.add("saved");
    container.innerHTML = `
      <div class="preview"></div>
      <div class="board-name">${puzzle.name}</div>
    `;
    document.querySelector(".home").append(container);
    new BaseBoard({
      puzzle,
      hostElement: container.querySelector(".preview"),
      moveHistory: save.moveHistory,
    });

    container.addEventListener("click", () => {
      boardContainer.innerHTML = "";
      this.mainBoard = new MainBoard({
        puzzle,
        cellSize: 40,
        hostElement: boardContainer,
        nameElement: puzzleName,
        moveCountElement: moveCount,
        moveHistory: save.moveHistory,
      });
      document.querySelector(".home-screen").classList.toggle("hidden");
    });
  }

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
        cellSize: 6,
        hostElement: previewElement,
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

document.querySelector(".lang-en")?.addEventListener("click", () => {
  Klotski.changeLanguage(Language.ENGLISH);
});

document.querySelector(".lang-hu")?.addEventListener("click", () => {
  Klotski.changeLanguage(Language.HUNGARIAN);
});

Klotski.init();
