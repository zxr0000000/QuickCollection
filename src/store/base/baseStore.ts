import { DefineStoreOptions, defineStore } from "pinia";
const ActionMethods = Symbol('Actions');
const GetterMethods = Symbol('Getters');

type StateTree = Record<string | number | symbol, any>;

export function transfer<T extends { new(...args: any[]): {} }>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
            const actionMethods = Base.prototype[ActionMethods];
            if (actionMethods) {
                (this as any).actions = actionMethods
            }
        }
    };
}

export function action(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (typeof descriptor.value !== 'function') {
        throw new Error('action must be a function')
    }
    if (target[ActionMethods]) {
        target[ActionMethods][propertyKey] = descriptor.value
    } else {
        target[ActionMethods] = {}
        target[ActionMethods][propertyKey] = descriptor.value
    }
    return descriptor;
}


export function getter(target: BaseStore, propertyKey: string, descriptor: PropertyDescriptor) {
    // if (typeof descriptor.value !== 'function') {
    //     throw new Error('action must be a function')
    // }
    // target.getters[propertyKey] = descriptor.value;
    // return descriptor;
}

export class BaseStore {
    state: () => StateTree;
    actions: any = {};
    getters: any = {};
    constructor(state: StateTree) {
        this.state = () => state;
    }
}