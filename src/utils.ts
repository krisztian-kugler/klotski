import { Cell } from "./interfaces";

export const toZeroBased = (value: string | number): number => {
  if (!Number.isInteger(+value)) throw new Error("Value must be convertible to an integer.");
  if (typeof value === "string") return parseInt(value) - 1;
  if (typeof value === "number") return value - 1;
  return NaN;
};

export const isSameCell = (a: Cell, b: Cell): boolean => a.col === b.col && a.row === b.row;

export const isDifferentCell = (a: Cell, b: Cell): boolean => a.col !== b.col || a.row !== b.row;
