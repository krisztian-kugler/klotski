import "./styles.scss";
import { OldBoard } from "./old.board";
import Board from "./board";
import * as Puzzles from "./puzzles";

const oldBoard = new OldBoard(Puzzles.forgetMeNot);
oldBoard.mount(".board-slot");
console.log(oldBoard);

const board = new Board(Puzzles.forgetMeNot, document.querySelector(".version"), document.querySelector(".logo"));
board.attach(".board-slot");
console.log(board);

document.querySelector(".header").addEventListener("click", function () {
  document.querySelector(".home-screen").classList.toggle("hidden");
});

document.querySelector(".reset").addEventListener("click", () => board.reset());
