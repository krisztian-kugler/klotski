type Class = new (...args: any[]) => any;
type Mixin = (superClass: Class) => Class;

const MovableMixin: Mixin = (superClass: Class) => {
  return class Movable extends superClass {
    constructor(...args: any[]) {
      super(...args);
    }

    protected move() {}
  };
};

const DestroyableMixin: Mixin = (superClass: Class) => {
  return class Destroyable extends superClass {
    constructor(...args: any[]) {
      super(...args);
    }

    protected destroy() {}
  };
};

const pipe = (a: Mixin, b: Mixin) => (superClass: Class) => b(a(superClass));
const compose = (...mixins: Mixin[]): Mixin => (baseClass: Class) => mixins.reduce(pipe)(baseClass);
