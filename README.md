# create-fast-context

-   Speeding up context creation in React

-   Using state selectors to ensure that only necessary components re-render, resulting in improved performance

-   Easily create and maintain multiple contexts

> Please Note: It's Recommended to Solve component level state management problems (prop drilling) with create-fast-context , and use state management libraries like Jotai, Zustand, and Redux for application global state

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
const [state, setState] = useStore(state => state.selector); //state selector

//updating the store
setState(prevStore => ({
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
type State = {
    user: {
        name: string;
    };
};

const { useStore } = createFastContext<State>({
    user: {
        name: 'John',
    },
}); //initialState
```

### Example

```tsx
import { createFastContext } from 'create-fast-context';

const { Provider, useStore } = createFastContext({ count: 0 }); //initialState

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
    const [count] = useStore(state => state.count); //state selector
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

### Reminder when rendering the same context provider

Sometimes we may use something like `items.map` to render a list of components that we want to have it's own context to avoid prop drilling an unnecessary re-renders,
just a reminder that the hook will use the state from it's parent provider

```tsx
//todoList

<TodoProvider> // {completed: false }
    <TodoItem/> //the hook will have access to its parent provider state
</TodoProvider>
<TodoProvider> // {completed: true }
    <TodoItem/> //the hook will have access to its parent provider state
</TodoProvider>
<TodoProvider> // {completed: false }
    <TodoItem/> //the hook will have access to its parent provider state
</TodoProvider>

```

---

> // inspired by jherr's video: [Making React Context FAST!](https://www.youtube.com/watch?v=ZKlXqrcBx88) and users comments
