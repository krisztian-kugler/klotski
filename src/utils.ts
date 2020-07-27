export const toZeroBased = (value: string | number): number => {
  if (!Number.isInteger(+value)) throw new Error("Value must be convertible to an integer.");
  if (typeof value === "string") return parseInt(value) - 1;
  if (typeof value === "number") return value - 1;
  return NaN;
};
