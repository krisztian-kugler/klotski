type Class = new (...args: any[]) => any;
type Mixin = (superClass: Class) => Class;

class Entity {
  constructor() {}
}

const Movable: Mixin = (superClass: Class) => {
  return class extends superClass {
    constructor(...args: any[]) {
      super(...args);
    }

    protected move() {}
  };
};

const Openable: Mixin = (superClass: Class) => {
  return class extends superClass {
    constructor(...args: any[]) {
      super(...args);
    }

    protected open() {}

    protected unlock() {}
  };
};

const pipe = (a: Mixin, b: Mixin) => (superClass: Class) => a(b(superClass));

const compose = (...mixins: Mixin[]): Mixin => {
  return (baseClass: Class) => {
    return mixins.reduce((a: Mixin, b: Mixin) => (superClass: Class) => a(b(superClass)))(baseClass);
  };
};

export class Test extends compose(Movable, Openable)(Entity) {
  constructor() {
    super();
  }
}
