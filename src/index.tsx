import React, {
    useRef,
    createContext,
    useContext,
    useCallback,
    useSyncExternalStore,
    useEffect,
} from 'react';
import type { ReactNode } from 'react';

type UpdateFunction<T> = (prev: T) => Partial<T>;

type StoreOptions = {
    /**
     * A boolean value indicating whether the component should update the store
     * based on incoming props changes. If set to true, the component will update
     * the store every time its props change. If set to false or not provided, the
     * component will only update the store when specific conditions are met.
     */
    updateOnPropsChange?: boolean;
};

export function createFastContext<Store extends object>(
    initialState: Store = {} as Store,
    options: StoreOptions = {}
) {
    function useStoreData<Props>(props?: Props): {
        get: () => Store;
        set: (updateFunction: UpdateFunction<Store>) => void;
        subscribe: (callback: () => void) => () => void;
    } {
        const store = useRef({ ...initialState, ...props });

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

        useEffect(() => {
            if (props && options?.updateOnPropsChange) set(() => props);
        }, [props]);

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
