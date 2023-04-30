import React, {
    useRef,
    createContext,
    useContext,
    useCallback,
    useSyncExternalStore,
} from 'react';

import type { ReactNode } from 'react';

type UpdateFunction<T> = (prev: T) => Partial<T>;

export function createFastContext<Store extends object>(
    initialState: Store = {} as Store
) {
    function useStoreData<Props>(props?: Props): {
        get: () => Store;
        set: (updateFunction: UpdateFunction<Store>) => void;
        subscribe: (callback: () => void) => () => void;
    } {
        const store = useRef(Object.assign(initialState, props));

        const get = useCallback(() => store.current, []);

        const subscribers = useRef(new Set<() => void>());

        const set = useCallback((updateFunction: UpdateFunction<Store>) => {
            store.current = {
                ...store.current,
                ...updateFunction(store.current),
            };
            subscribers.current.forEach((callback: () => void) => callback());
        }, []);

        const subscribe = useCallback((callback: () => void) => {
            subscribers.current.add(callback);
            return () => subscribers.current.delete(callback);
        }, []);

        return {
            get,
            set,
            subscribe,
        };
    }

    type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

    type ProviderParameters = {
        children: ReactNode;
        [props: string]: any;
    };

    const StoreContext = createContext<UseStoreDataReturnType | null>(null);

    function Provider({ children, ...props }: ProviderParameters) {
        return (
            <StoreContext.Provider value={useStoreData(props)}>
                {children}
            </StoreContext.Provider>
        );
    }

    function useStore<SelectorOutput>(
        selector: (store: Store) => SelectorOutput
    ): [SelectorOutput, (updateFunction: UpdateFunction<Store>) => void] {
        const store = useContext(StoreContext);
        if (!store) {
            throw new Error('Store not found');
        }

        const state = useSyncExternalStore(store.subscribe, () =>
            selector(store.get())
        );

        return [state, store.set];
    }

    function useSetStore() {
        const store = useContext(StoreContext);
        if (!store) {
            throw new Error('Store not found');
        }

        return store.set;
    }

    return {
        Provider,
        useStore,
        useSetStore,
    };
}
