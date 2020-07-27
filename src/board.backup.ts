/* import { GridCell } from "./models";

export type EntityType = Block | Wall | Target | Gate;
export interface EntityConfig {
  classList?: string[];
  attributes?: { [key: string]: string };
  movable?: boolean;
  border?: boolean;
  takesUpSpace?: boolean;
  isTarget?: boolean;
}

interface EntityShape {
  classList: string[];
  movable: boolean;
  takesUpSpace: boolean;
}

export class Entity {
  elements: HTMLDivElement[] = [];

  constructor(public cells: GridCell[], public id: number) {}

  protected createElements(classList: string[]) {
    this.cells.forEach(cell => {
      const element = document.createElement("div");
      element.classList.add(...classList);
      element.style.gridRowStart = cell.row.toString();
      element.style.gridColumnStart = cell.column.toString();
      element.setAttribute("entity-id", this.id.toString());
      this.elements.push(element);

      // Put border creation logic here!!
    });
  }
}

// Mixins
const BorderMixin = (superclass: new (...args: any[]) => any) =>
  class extends superclass {
    constructor(...args: any[]) {
      super(...args);
    }

    createBorders() {
      console.log("borders created!");
    }
  };

const UnlockMixin = (superclass: new (...args: any[]) => any) =>
  class Unlock extends superclass {
    constructor(...args: any[]) {
      super(...args);
    }

    unlock() {
      console.log("unlocked!");
      this.elements.forEach((element: HTMLElement) => {
        element.classList.add("unlocked");
      });
    }
  };

export class Block extends BorderMixin(Entity) implements EntityShape {
  readonly classList = [Block.name.toLowerCase()];
  readonly takesUpSpace = true;
  readonly movable = true;

  constructor(cells: GridCell[], id: number, isTarget: boolean) {
    super(cells, id);
    if (isTarget) this.classList.push("target-block");
    this.createElements(this.classList);
    this.createBorders();
  }
}

export class Target extends Entity implements EntityShape {
  readonly classList = [Target.name.toLowerCase()];
  readonly takesUpSpace = false;
  readonly movable = false;

  constructor(cells: GridCell[], id: number) {
    super(cells, id);
    this.createElements(this.classList);
  }
}

export class Wall extends BorderMixin(Entity) implements EntityShape {
  readonly classList = [Wall.name.toLowerCase()];
  readonly takesUpSpace = true;
  readonly movable = false;

  constructor(cells: GridCell[], id: number) {
    super(cells, id);
    this.createElements(this.classList);
  }
}

export class Gate extends BorderMixin(UnlockMixin(Entity)) implements EntityShape {
  readonly classList = [Gate.name.toLowerCase()];
  readonly takesUpSpace = true;
  readonly movable = false;

  unlocked = false;

  constructor(cells: GridCell[], id: number) {
    super(cells, id);
    this.createElements(this.classList);
  }

  open(row: number, column: number) {}
}
 */
