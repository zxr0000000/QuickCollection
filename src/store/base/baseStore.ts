import { DefineStoreOptions, defineStore } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';

const ActionMethods = Symbol('Actions');
const GetterMethods = Symbol('Getters');

type StateTree = Record<string | number | symbol, any>;
export type StoreConstructor<C = BaseStore> = {
  new (...args: unknown[]): C;
} & {
  CREATE: any;
};

export function transfer<T extends { new (...args: any[]): {} }>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      const getterMethods = Base.prototype[GetterMethods];
      if (getterMethods) {
        (this as any).__getters = getterMethods;
      }
    }
  };
}

export function getter(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  if (typeof descriptor.value !== 'function') {
    throw new Error('getter must be a function');
  }
  if (target[GetterMethods]) {
    target[GetterMethods][propertyKey] = descriptor.value;
  } else {
    target[GetterMethods] = {};
    target[GetterMethods][propertyKey] = descriptor.value;
  }
  return descriptor;
}

export abstract class BaseStore {
  abstract id: string;
  __state: () => StateTree;
  __actions: any = {};
  __getters: any = {};

  static CREATE: any | null = null;

  state: StateTree = {};

  constructor(state: StateTree) {
    this.__state = () => state;
  }

  _init() {
    this.onStoreReady();
  }

  onStoreReady() {}

  onMount() {}

  destroy() {}

  static useStoreInstance() {
    if (!this.CREATE) {
      throw new Error('use useStoreDeclaration first');
    }
    return this.CREATE();
  }

  static useStoreDeclaration<C extends StoreConstructor>(this: C) {
    const instanceRef = ref<any>(null);

    onMounted(() => {
      instanceRef.value.onMount();
    });

    onUnmounted(() => {
      instanceRef.value.destroy();
    });

    if (instanceRef.value) {
      // update
    } else {
      const ins = new this();
      instanceRef.value = ins;
      this.CREATE = defineStore(ins.id, {
        state: ins.__state,
        actions: ins.__actions,
        getters: ins.__getters
      });
      const store = this.CREATE();

      // attach proxy
      ins.state = store.$state;

      ins._init.call(ins);

      return ins;
    }
  }
}
