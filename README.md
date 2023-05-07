# create-fast-context

-   Speeding up context creation in React

-   Using state selectors to ensure that only necessary components re-render, resulting in improved performance

-   Easily create and maintain multiple contexts

> Note: It's Recommended to Solve component level state management problems (prop drilling) with create-fast-context , and use state management libraries like Jotai, Zustand/Redux or React-Query for application global state

### Install

```sh
npm i create-fast-context
# or
yarn add create-fast-context
```

> requires `react v18+` as it's using the new hook `useSyncExternalStore`

### Using

```tsx
import { createFastContext } from 'create-fast-context';

//myContext.tsx
const { Provider, useStore, useSetStore } = createFastContext(initialState); //initialState

//component
const [store, setStore] = useStore(store => store.selector); //state selector

//updating the store
setStore(prevStore => ({
    user: { ...prevStore.user, isOnline: true },
}));

// updating the store (without subscribing with selectors)
// great if the component using this hook won't depends on the value to re-render
const setStore = useSetStore();
setStore(prev => ({ newState }));
```

#### Typescript

`createFastContext` infers the type from initialState shape, but you can also pass your own type

```tsx
type UserStore = {
    user: {
        name: string;
    };
};

const { useStore } = createFastContext<UserStore>({
    user: {
        name: 'John',
    },
}); //initialState
```

### Example

```tsx
import { createFastContext } from 'create-fast-context';

const { Provider, useStore, useSetStore } = createFastContext({ count: 0 }); //initialState

function MyApp() {
    return (
        <Provider>
            <Counter />
            <AddButton />
        </Provider>
    );
}
//components
function Counter() {
    // only Counter will re-render when state changes
    const [count] = useStore(store => store.count); //state selector
    return <p>{count}</p>;
}

function AddButton() {
    const setStore = useSetStore();

    function incrementCount() {
        setStore(prev => ({ count: prev.count + 1 })); //updating the store
    }

    return <button onClick={incrementCount}>Increment</button>;
}
```

### Selectors

```tsx
const { Provider, useStore, useSetStore } = createFastContext({
    user: {
        name: 'John Doe',
        coins: 100,
    },
});

function CoinDisplay() {
    // CoinDisplay will re-render only if user.coins changes
    const [coins] = useStore(store => store.user.coins); //state selector
    return <p>{coins}</p>;
}
```

### Recommended Pattern for multiple contexts

> this is also known as singleton and closures pattern

this ensures that `createFastContext` function remains called only once

```tsx
//Project.Context.tsx
const { Provider, useStore } = createFastContext(initialState); //initialState
export { Provider as ProjectProvider, useStore as useProjectStore };

//component
import { ProjectProvider, useProjectStore } from './Project.Context';
```

```tsx
//Todo.Context.tsx
const { Provider, useStore } = createFastContext(initialState); //initialState
export { Provider as TodoProvider, useStore as useTodoStore };

//component
import { TodoProvider, useTodoStore } from './Todo.Context';
```

```tsx
//User.Context.tsx
const { Provider, useStore } = createFastContext(initialState); //initialState
export { Provider as UserProvider, useStore as useUserStore };

//component
import { UserProvider, useUserStore } from './User.Context';
```

Another syntax:

```tsx
//Project.Context.tsx
export const { Provider: ProjectProvider, useStore: useProjectStore } =
    createFastContext(initialState, options);
```

### Reminder when rendering the same context provider

Sometimes we may use something like `items.map` to render a list of components that we want to have it's own context to avoid prop drilling an unnecessary re-renders,
just a reminder that the hook will use the state from it's parent provider

```tsx
//todoList

<TodoProvider> // {todos: [{completed: false }]}
    <TodoItem/> //the hook will have access to its parent provider state
</TodoProvider>
<TodoProvider> // {todos: [{completed: true }]}
    <TodoItem/> //the hook will have access to its parent provider state
</TodoProvider>
<TodoProvider> // {todos: []}
    <TodoItem/> //the hook will have access to its parent provider state
</TodoProvider>

```

## Options

```tsx
createFastContext(initialState, options);
```

### updateOnPropsChange

```tsx
type StoreOptions = {
    /**
     * A boolean value indicating whether the component should update the store
     * based on incoming props changes. If set to true, the component will update
     * the store every time its props change. If set to false or not provided, the
     * component will only update the store when specific conditions are met.
     */
    updateOnPropsChange?: boolean;
};
```

```tsx
function App() {
    const [state, setState] = useState(); // initialState via props

    return <Provider state={state}>{/* <- this props */}</Provider>;
}
```

```tsx
setState(newState);
```

`updateOnPropsChange` is to determine if it should update Store with the newState value

```js
// example:

initialState: {
    count: 0;
} //createFastContext({count: 0}, {updateOnPropsChange: true})

props: {
    count: 1;
} // const [count, setCount] = useState({count: 1}) <Provider count={count}>

setCount({ count: 2 });

//the current store.count value will be 2
```

this option is only necessary when the store needs to be synced with the props

Now to be more clear:

```js
// the default behavior:
const {Provider} = createFastContext({count: 0}) // initialState

const [countState, setCountState] = useState({count: 1})

<Provider count={countState}> // props

setCount({ count: 2 });
setCount({ count: 3 });
setCount({ count: 4 });

// you can update props however you want but the store will be the same
//the current store.count value will be 1

<Provider > // without props
//the current store.count value will be 0 (initialState)

// Q: So what now ?
// A: use the store Setter

const [count, setCount] = useStore(); // or const setCount = useSetStore()

setCount(prev => {
    count: prev.count + 1;
});
```

---

> // inspired by jherr's video: [Making React Context FAST!](https://www.youtube.com/watch?v=ZKlXqrcBx88) and users comments
