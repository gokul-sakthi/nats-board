export interface Lifecycle<T> {
    init: () => T;
    // eslint-disable-next-line no-unused-vars
    close?: (t: T) => void | Promise<void>;
}

export interface Singleton<T> {
    getInstance(): T;
    close(): Promise<void>;
}

export function createSingleton<T>(lifecycle: Lifecycle<T>): Singleton<T> {
    return class Singleton {
        static #inner?: T;

        private constructor() {
            // Private constructor to prevent instantiation from outside
        }

        public static getInstance(): T {
            if (!Singleton.#inner) {
                Singleton.#inner = lifecycle.init();
            }
            return Singleton.#inner;
        }

        public static async close(): Promise<void> {
            const inner = Singleton.#inner;
            Singleton.#inner = undefined;
            if (lifecycle.close && inner) {
                await lifecycle.close(inner);
            }
        }
    };
}

export interface AsyncLifecycle<T> {
    init: () => Promise<T>;
    // eslint-disable-next-line no-unused-vars
    close?: (t: T) => void | Promise<void>;
    // eslint-disable-next-line no-unused-vars
    restart?: (t: T) => void | Promise<void>;
}

export interface AsyncSingleton<T> {
    getInstance(): Promise<T>;
    close(): Promise<void>;
    restart(): Promise<void>;
}

export function createAsyncSingleton<T>(lifecycle: AsyncLifecycle<T>): AsyncSingleton<T> {
    return class AsyncSingleton {
        static #inner?: T;

        private constructor() {
            // Private constructor to prevent instantiation from outside
        }

        public static async getInstance(): Promise<T> {
            if (!AsyncSingleton.#inner) {
                AsyncSingleton.#inner = await lifecycle.init();
            }
            return AsyncSingleton.#inner;
        }

        public static async close(): Promise<void> {
            const inner = AsyncSingleton.#inner;
            AsyncSingleton.#inner = undefined;
            if (lifecycle.close && inner) {
                await lifecycle.close(inner);
            }
        }

        public static async restart(): Promise<void> {
            const inner = AsyncSingleton.#inner;
            if (lifecycle.close && inner) {
                await lifecycle.close(inner);
                AsyncSingleton.#inner = undefined;
                AsyncSingleton.#inner = await lifecycle.init();
            }
        }
    };
}
