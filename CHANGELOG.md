# 0.1.0

First release 🎈

### Usage

```tsx
import { createFastContext } from 'create-fast-context';

//myContext.tsx
const { Provider, useStore } = createFastContext(initialState); //initialState

//component
const [state, setStore] = useStore(state => state.selector); //state selector

//updating store
setStore(prevStore => ({
    user: { ...prevStore.user, isOnline: true },
}));
```
