import { DisposableStore, IDisposable } from "./lifecycle";

export interface Event<T> {
    (listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[] | DisposableStore): IDisposable;
}