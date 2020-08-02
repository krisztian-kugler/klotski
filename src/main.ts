import "./styles.scss";
import Board from "./board.canvas";

import {
  oldestGame,
  oldestGame2,
  oldestGame3,
  oldestGame4,
  oldestGame5,
  oldestGame6,
  agatka,
  doggie,
  success,
  bone,
  fortune,
  sunshine,
  fool,
  solomon,
  kleopatra,
  shark,
} from "./set1";
import { Test } from "./entities.canvas";

const board = new Board(fool);
board.attach(".board-wrapper");
console.log(board);

/* const board = new Board(sunshine);
board.mount(".board-slot");
console.log(board);

document.querySelector(".burger-icon").addEventListener("click", function () {
  document.querySelector(".home-screen").classList.toggle("hidden");
});

const testInstance = new Test();
console.log(testInstance); */
