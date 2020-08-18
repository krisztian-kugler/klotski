import "./styles.scss";
import { OldBoard } from "./old.board";
import Board from "./board";
import * as Puzzles from "./puzzles";

const oldBoard = new OldBoard(Puzzles.forgetMeNot);
oldBoard.mount(".board-slot");
console.log(oldBoard);

const board = new Board(Puzzles.forgetMeNot);
board.attach(".board-slot");
console.log(board);

document.querySelector(".burger-icon").addEventListener("click", function () {
  document.querySelector(".home-screen").classList.toggle("hidden");
});

document.querySelector(".reset").addEventListener("click", () => board.reset());
