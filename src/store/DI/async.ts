import { IDisposable } from "./lifecycle";


type IdleApi = Pick<typeof globalThis, 'requestIdleCallback' | 'cancelIdleCallback'>;

export let runWhenGlobalIdle: (callback: (idle: IdleDeadline) => void, timeout?: number) => IDisposable;
export let _runWhenIdle: (targetWindow: IdleApi, callback: (idle: IdleDeadline) => void, timeout?: number) => IDisposable;

// 降级实现一下
const setTimeout0 = (callback: () => void) => {
    setTimeout(() => {
        callback()
    }, 0);
}

(function () {
    if (typeof globalThis.requestIdleCallback !== 'function' || typeof globalThis.cancelIdleCallback !== 'function') {
        _runWhenIdle = (_targetWindow, runner) => {
            setTimeout0(() => {
                if (disposed) {
                    return;
                }
                const end = Date.now() + 15; // one frame at 64fps
                const deadline: IdleDeadline = {
                    didTimeout: true,
                    timeRemaining() {
                        return Math.max(0, end - Date.now());
                    }
                };
                runner(Object.freeze(deadline));
            });
            let disposed = false;
            return {
                dispose() {
                    if (disposed) {
                        return;
                    }
                    disposed = true;
                }
            };
        };
    } else {
        _runWhenIdle = (targetWindow: IdleApi, runner, timeout?) => {
            const handle: number = targetWindow.requestIdleCallback(runner, typeof timeout === 'number' ? { timeout } : undefined);
            let disposed = false;
            return {
                dispose() {
                    if (disposed) {
                        return;
                    }
                    disposed = true;
                    targetWindow.cancelIdleCallback(handle);
                }
            };
        };
    }
    runWhenGlobalIdle = (runner) => _runWhenIdle(globalThis, runner);
})();

export abstract class AbstractIdleValue<T> {

    private readonly _executor: () => void;
    private readonly _handle: IDisposable;

    private _didRun: boolean = false;
    private _value?: T;
    private _error: unknown;

    constructor(targetWindow: IdleApi, executor: () => T) {
        this._executor = () => {
            try {
                this._value = executor();
            } catch (err) {
                this._error = err;
            } finally {
                this._didRun = true;
            }
        };
        this._handle = _runWhenIdle(targetWindow, () => this._executor());
    }

    dispose(): void {
        this._handle.dispose();
    }

    get value(): T {
        if (!this._didRun) {
            this._handle.dispose();
            this._executor();
        }
        if (this._error) {
            throw this._error;
        }
        return this._value!;
    }

    get isInitialized(): boolean {
        return this._didRun;
    }
}

export class GlobalIdleValue<T> extends AbstractIdleValue<T> {

    constructor(executor: () => T) {
        super(globalThis, executor);
    }
}