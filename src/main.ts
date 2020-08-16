import "./styles.scss";
import { Board } from "./old.board";
import * as Puzzles from "./puzzles";

/* const board = new Board(fool);
board.attach(".board-wrapper");
console.log(board); */

const board = new Board(Puzzles.forgetMeNot);
board.mount(".board-slot");
console.log(board);

document.querySelector(".burger-icon").addEventListener("click", function () {
  document.querySelector(".home-screen").classList.toggle("hidden");
});
