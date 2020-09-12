import { Puzzle, Cell } from "./interfaces";

const errorStart = "Board validation failed:";

export const validateBoard = (config: Puzzle) => {
  if (config.rows === undefined) {
    throw new Error(errorStart + " 'rows' is missing.");
  }

  if (config.cols === undefined) {
    throw new Error(errorStart + " 'cols' is missing.");
  }

  if (config.master === undefined) {
    throw new Error(errorStart + " 'targetBlock' is missing.");
  }

  if (config.target === undefined) {
    throw new Error(errorStart + " 'targetZone' is missing.");
  }

  if (typeof config.rows !== "number" || config.rows < 2) {
    throw new Error(errorStart + " 'rows' must be a positive integer greater than 1.");
  }

  if (typeof config.cols !== "number" || config.cols < 2) {
    throw new Error(errorStart + " 'cols' must be a positive integer greater than 1.");
  }

  if (!Array.isArray(config.master) || !config.master.length) {
    throw new Error(errorStart + " 'targetBlock' must be a non-empty array.");
  }

  if (!Array.isArray(config.target) || !config.target.length) {
    // throw new Error(errorStart + " 'targetZone' must be a non-empty array.");
  }

  // Shape of targetBlock and targetZone must be identical (their coverage matrix must be the same)

  const hash: Cell[] = [];
};
