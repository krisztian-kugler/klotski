import { GridCell } from "./models";

export type EntityType = Block | Target | Wall | Gate;

export interface EntityConfig {
  classList?: string[];
  attributes?: { [key: string]: string };
  movable?: boolean;
  border?: boolean;
}

export class Entity {
  elements: HTMLElement[] = [];

  constructor(public cells: GridCell[], public id: number) {}

  protected createElements(classList: string[]) {
    for (const cell of this.cells) {
      const element = document.createElement("div");
      element.classList.add("entity", ...classList);
      element.style.gridRowStart = cell.row.toString();
      element.style.gridColumnStart = cell.column.toString();
      element.setAttribute("entity-id", this.id.toString());

      /* const core = document.createElement("div");
      core.classList.add("core");
      element.append(core); */
      this.elements.push(element);
    }
  }
}

// Mixins
const BorderMixin = (superclass: new (...args: any[]) => Entity) =>
  class extends superclass {
    constructor(...args: any[]) {
      super(...args);
    }

    protected addBorder() {
      for (const element of this.elements) {
        const row = +element.style.gridRowStart;
        const column = +element.style.gridColumnStart;
        let top, bottom, left, right;

        if (this.cells.find(cell => cell.column === column && cell.row === row - 1)) top = true;
        if (this.cells.find(cell => cell.column === column && cell.row === row + 1)) bottom = true;
        if (this.cells.find(cell => cell.row === row && cell.column === column - 1)) left = true;
        if (this.cells.find(cell => cell.row === row && cell.column === column + 1)) right = true;

        if (top && bottom) element.classList.add("edge-top-bottom");
        else if (top) element.classList.add("edge-top");
        else if (bottom) element.classList.add("edge-bottom");

        if (left && right) element.classList.add("edge-left-right");
        else if (left) element.classList.add("edge-left");
        else if (right) element.classList.add("edge-right");

        if (!top && !bottom && !left && !right) element.classList.add("center");

        if (
          top &&
          ((left && this.cells.find(cell => cell.row === row - 1 && cell.column === column - 1)) ||
            (right && this.cells.find(cell => cell.row === row - 1 && cell.column === column + 1)))
        ) {
          const corner = document.createElement("div");

          if (left && right) corner.classList.add("corner-top-left-right");
          else if (left) corner.classList.add("corner-top-left");
          else if (right) corner.classList.add("corner-top-right");

          element.append(corner);
        }

        if (
          bottom &&
          ((left && this.cells.find(cell => cell.row === row + 1 && cell.column === column - 1)) ||
            (right && this.cells.find(cell => cell.row === row + 1 && cell.column === column + 1)))
        ) {
          const corner = document.createElement("div");

          if (left && right) corner.classList.add("corner-bottom-left-right");
          else if (left) corner.classList.add("corner-bottom-left");
          else if (right) corner.classList.add("corner-bottom-right");

          element.append(corner);
        }
      }
    }
  };

const UnlockMixin = (superclass: new (...args: any[]) => Entity) =>
  class extends superclass {
    constructor(...args: any[]) {
      super(...args);
    }

    protected unlock() {
      this.elements.forEach((element: HTMLElement) => {
        element.classList.add("unlocked");
      });
    }
  };

export class Block extends BorderMixin(Entity) {
  constructor(cells: GridCell[], id: number, public master = false) {
    super(cells, id);
    let classList = ["block"];
    if (master) classList = ["master-block"];
    this.createElements(classList);
    this.addBorder();
    this.elements.forEach(element => {
      element.setAttribute("draggable", "");
    });
  }
}

export class Target extends Entity {
  constructor(cells: GridCell[], id: number) {
    super(cells, id);
    this.createElements(["target"]);
  }
}

export class Wall extends BorderMixin(Entity) {
  constructor(cells: GridCell[], id: number) {
    super(cells, id);
    this.createElements(["wall"]);
    this.addBorder();
  }
}

export class Gate extends BorderMixin(Entity) {
  unlocked = false;

  constructor(cells: GridCell[], id: number) {
    super(cells, id);
    this.createElements(["gate"]);
    this.addBorder();
  }

  unlockElement(cell: GridCell) {
    for (const element of this.elements) {
      if (+element.style.gridRowStart === cell.row && +element.style.gridColumnStart === cell.column) {
        element.classList.add("unlocked");
      }
    }

    if (this.elements.every(element => element.classList.contains("unlocked"))) {
      this.unlocked = true;
      for (const element of this.elements) {
        element.classList.add("openable");
      }
    }
  }

  open() {
    for (const element of this.elements) {
      element.remove();
    }
  }
}
