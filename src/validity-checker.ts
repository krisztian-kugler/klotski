import { BoardConfig, GridCell } from "./models";

const errorStart = "Board validation failed:";

export const validateBoard = (config: BoardConfig) => {
  if (config.rows === undefined) {
    throw new Error(errorStart + " 'rows' is missing.");
  }

  if (config.columns === undefined) {
    throw new Error(errorStart + " 'columns' is missing.");
  }

  if (config.masterBlock === undefined) {
    throw new Error(errorStart + " 'targetBlock' is missing.");
  }

  if (config.target === undefined) {
    throw new Error(errorStart + " 'targetZone' is missing.");
  }

  if (typeof config.rows !== "number" || config.rows < 2) {
    throw new Error(errorStart + " 'rows' must be a positive integer greater than 1.");
  }

  if (typeof config.columns !== "number" || config.columns < 2) {
    throw new Error(errorStart + " 'columns' must be a positive integer greater than 1.");
  }

  if (!Array.isArray(config.masterBlock) || !config.masterBlock.length) {
    throw new Error(errorStart + " 'targetBlock' must be a non-empty array.");
  }

  if (!Array.isArray(config.target) || !config.target.length) {
    // throw new Error(errorStart + " 'targetZone' must be a non-empty array.");
  }

  // Shape of targetBlock and targetZone must be identical (their coverage matrix must be the same)

  const hash: GridCell[] = [];
};
