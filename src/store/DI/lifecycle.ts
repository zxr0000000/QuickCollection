import { createSingleCallFunction } from "./functional";

/**
 * Enables logging of potentially leaked disposables.
 *
 * A disposable is considered leaked if it is not disposed or not registered as the child of
 * another disposable. This tracking is very simple an only works for classes that either
 * extend Disposable or use a DisposableStore. This means there are a lot of false positives.
 */
const TRACK_DISPOSABLES = true;
let disposableTracker: IDisposableTracker | null = null;

export namespace Iterable {

    export function is<T = any>(thing: any): thing is Iterable<T> {
        return thing && typeof thing === 'object' && typeof thing[Symbol.iterator] === 'function';
    }

    const _empty: Iterable<any> = Object.freeze([]);
    export function empty<T = any>(): Iterable<T> {
        return _empty;
    }

    export function* single<T>(element: T): Iterable<T> {
        yield element;
    }

    export function wrap<T>(iterableOrElement: Iterable<T> | T): Iterable<T> {
        if (is(iterableOrElement)) {
            return iterableOrElement;
        } else {
            return single(iterableOrElement);
        }
    }

    export function from<T>(iterable: Iterable<T> | undefined | null): Iterable<T> {
        return iterable || _empty;
    }

    export function* reverse<T>(array: Array<T>): Iterable<T> {
        for (let i = array.length - 1; i >= 0; i--) {
            yield array[i];
        }
    }

    export function isEmpty<T>(iterable: Iterable<T> | undefined | null): boolean {
        return !iterable || iterable[Symbol.iterator]().next().done === true;
    }

    export function first<T>(iterable: Iterable<T>): T | undefined {
        return iterable[Symbol.iterator]().next().value;
    }

    export function some<T>(iterable: Iterable<T>, predicate: (t: T) => unknown): boolean {
        for (const element of iterable) {
            if (predicate(element)) {
                return true;
            }
        }
        return false;
    }

    export function find<T, R extends T>(iterable: Iterable<T>, predicate: (t: T) => t is R): R | undefined;
    export function find<T>(iterable: Iterable<T>, predicate: (t: T) => boolean): T | undefined;
    export function find<T>(iterable: Iterable<T>, predicate: (t: T) => boolean): T | undefined {
        for (const element of iterable) {
            if (predicate(element)) {
                return element;
            }
        }

        return undefined;
    }

    export function filter<T, R extends T>(iterable: Iterable<T>, predicate: (t: T) => t is R): Iterable<R>;
    export function filter<T>(iterable: Iterable<T>, predicate: (t: T) => boolean): Iterable<T>;
    export function* filter<T>(iterable: Iterable<T>, predicate: (t: T) => boolean): Iterable<T> {
        for (const element of iterable) {
            if (predicate(element)) {
                yield element;
            }
        }
    }

    export function* map<T, R>(iterable: Iterable<T>, fn: (t: T, index: number) => R): Iterable<R> {
        let index = 0;
        for (const element of iterable) {
            yield fn(element, index++);
        }
    }

    export function* concat<T>(...iterables: Iterable<T>[]): Iterable<T> {
        for (const iterable of iterables) {
            yield* iterable;
        }
    }

    export function reduce<T, R>(iterable: Iterable<T>, reducer: (previousValue: R, currentValue: T) => R, initialValue: R): R {
        let value = initialValue;
        for (const element of iterable) {
            value = reducer(value, element);
        }
        return value;
    }

    /**
     * Returns an iterable slice of the array, with the same semantics as `array.slice()`.
     */
    export function* slice<T>(arr: ReadonlyArray<T>, from: number, to = arr.length): Iterable<T> {
        if (from < 0) {
            from += arr.length;
        }

        if (to < 0) {
            to += arr.length;
        } else if (to > arr.length) {
            to = arr.length;
        }

        for (; from < to; from++) {
            yield arr[from];
        }
    }

    /**
     * Consumes `atMost` elements from iterable and returns the consumed elements,
     * and an iterable for the rest of the elements.
     */
    export function consume<T>(iterable: Iterable<T>, atMost: number = Number.POSITIVE_INFINITY): [T[], Iterable<T>] {
        const consumed: T[] = [];

        if (atMost === 0) {
            return [consumed, iterable];
        }

        const iterator = iterable[Symbol.iterator]();

        for (let i = 0; i < atMost; i++) {
            const next = iterator.next();

            if (next.done) {
                return [consumed, Iterable.empty()];
            }

            consumed.push(next.value);
        }

        return [consumed, { [Symbol.iterator]() { return iterator; } }];
    }

    export async function asyncToArray<T>(iterable: AsyncIterable<T>): Promise<T[]> {
        const result: T[] = [];
        for await (const item of iterable) {
            result.push(item);
        }
        return Promise.resolve(result);
    }
}

export function markAsDisposed(disposable: IDisposable): void {
    disposableTracker?.markAsDisposed(disposable);
}

export function setDisposableTracker(tracker: IDisposableTracker | null): void {
    disposableTracker = tracker;
}

function setParentOfDisposable(child: IDisposable, parent: IDisposable | null): void {
    disposableTracker?.setParent(child, parent);
}

/**
 * Disposes of the value(s) passed in.
 */
export function dispose<T extends IDisposable>(disposable: T): T;
export function dispose<T extends IDisposable>(disposable: T | undefined): T | undefined;
export function dispose<T extends IDisposable, A extends Iterable<T> = Iterable<T>>(disposables: A): A;
export function dispose<T extends IDisposable>(disposables: Array<T>): Array<T>;
export function dispose<T extends IDisposable>(disposables: ReadonlyArray<T>): ReadonlyArray<T>;
export function dispose<T extends IDisposable>(arg: T | Iterable<T> | undefined): any {
    if (Iterable.is(arg)) {
        const errors: any[] = [];

        for (const d of arg) {
            if (d) {
                try {
                    d.dispose();
                } catch (e) {
                    errors.push(e);
                }
            }
        }

        if (errors.length === 1) {
            throw errors[0];
        } else if (errors.length > 1) {
            throw new AggregateError(errors, 'Encountered errors while disposing of store');
        }

        return Array.isArray(arg) ? [] : arg;
    } else if (arg) {
        arg.dispose();
        return arg;
    }
}

export interface IDisposableTracker {
    /**
     * Is called on construction of a disposable.
    */
    trackDisposable(disposable: IDisposable): void;

    /**
     * Is called when a disposable is registered as child of another disposable (e.g. {@link DisposableStore}).
     * If parent is `null`, the disposable is removed from its former parent.
    */
    setParent(child: IDisposable, parent: IDisposable | null): void;

    /**
     * Is called after a disposable is disposed.
    */
    markAsDisposed(disposable: IDisposable): void;

    /**
     * Indicates that the given object is a singleton which does not need to be disposed.
    */
    markAsSingleton(disposable: IDisposable): void;
}

export function trackDisposable<T extends IDisposable>(x: T): T {
    disposableTracker?.trackDisposable(x);
    return x;
}

/**
 * Manages a collection of disposable values.
 *
 * This is the preferred way to manage multiple disposables. A `DisposableStore` is safer to work with than an
 * `IDisposable[]` as it considers edge cases, such as registering the same value multiple times or adding an item to a
 * store that has already been disposed of.
 */
export class DisposableStore implements IDisposable {

    static DISABLE_DISPOSED_WARNING = false;

    private readonly _toDispose = new Set<IDisposable>();
    private _isDisposed = false;

    constructor() {
        trackDisposable(this);
    }

    /**
     * Dispose of all registered disposables and mark this object as disposed.
     *
     * Any future disposables added to this object will be disposed of on `add`.
     */
    public dispose(): void {
        if (this._isDisposed) {
            return;
        }

        markAsDisposed(this);
        this._isDisposed = true;
        this.clear();
    }

    /**
     * @return `true` if this object has been disposed of.
     */
    public get isDisposed(): boolean {
        return this._isDisposed;
    }

    /**
     * Dispose of all registered disposables but do not mark this object as disposed.
     */
    public clear(): void {
        if (this._toDispose.size === 0) {
            return;
        }

        try {
            dispose(this._toDispose);
        } finally {
            this._toDispose.clear();
        }
    }

    /**
     * Add a new {@link IDisposable disposable} to the collection.
     */
    public add<T extends IDisposable>(o: T): T {
        if (!o) {
            return o;
        }
        if ((o as unknown as DisposableStore) === this) {
            throw new Error('Cannot register a disposable on itself!');
        }

        setParentOfDisposable(o, this);
        if (this._isDisposed) {
            if (!DisposableStore.DISABLE_DISPOSED_WARNING) {
                console.warn(new Error('Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!').stack);
            }
        } else {
            this._toDispose.add(o);
        }

        return o;
    }

    /**
     * Deletes a disposable from store and disposes of it. This will not throw or warn and proceed to dispose the
     * disposable even when the disposable is not part in the store.
     */
    public delete<T extends IDisposable>(o: T): void {
        if (!o) {
            return;
        }
        if ((o as unknown as DisposableStore) === this) {
            throw new Error('Cannot dispose a disposable on itself!');
        }
        this._toDispose.delete(o);
        o.dispose();
    }

    /**
     * Deletes the value from the store, but does not dispose it.
     */
    public deleteAndLeak<T extends IDisposable>(o: T): void {
        if (!o) {
            return;
        }
        if (this._toDispose.has(o)) {
            this._toDispose.delete(o);
            setParentOfDisposable(o, null);
        }
    }
}

export abstract class Disposable implements IDisposable {

    /**
     * A disposable that does nothing when it is disposed of.
     *
     * TODO: This should not be a static property.
     */
    static readonly None = Object.freeze<IDisposable>({ dispose() { } });

    protected readonly _store = new DisposableStore();

    constructor() {
        trackDisposable(this);
        setParentOfDisposable(this._store, this);
    }

    public dispose(): void {
        markAsDisposed(this);

        this._store.dispose();
    }

    /**
     * Adds `o` to the collection of disposables managed by this object.
     */
    protected _register<T extends IDisposable>(o: T): T {
        if ((o as unknown as Disposable) === this) {
            throw new Error('Cannot register a disposable on itself!');
        }
        return this._store.add(o);
    }
}

export function toDisposable(fn: () => void): IDisposable {
    const self = trackDisposable({
        dispose: createSingleCallFunction(() => {
            markAsDisposed(self);
            fn();
        })
    });
    return self;
}


export interface IDisposable {
    dispose(): void;
}

if (TRACK_DISPOSABLES) {
    const __is_disposable_tracked__ = '__is_disposable_tracked__';
    setDisposableTracker(new class implements IDisposableTracker {
        trackDisposable(x: IDisposable): void {
            const stack = new Error('Potentially leaked disposable').stack!;
            setTimeout(() => {
                if (!(x as any)[__is_disposable_tracked__]) {
                    console.log(stack);
                }
            }, 3000);
        }

        setParent(child: IDisposable, parent: IDisposable | null): void {
            if (child && child !== Disposable.None) {
                try {
                    (child as any)[__is_disposable_tracked__] = true;
                } catch {
                    // noop
                }
            }
        }

        markAsDisposed(disposable: IDisposable): void {
            if (disposable && disposable !== Disposable.None) {
                try {
                    (disposable as any)[__is_disposable_tracked__] = true;
                } catch {
                    // noop
                }
            }
        }
        markAsSingleton(disposable: IDisposable): void { }
    });
}
