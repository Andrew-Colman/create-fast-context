import React from 'react';
import { createFastContext } from '@src/index';
import { screen, setup } from './test-utils';

const { Provider, useStore, useSetStore } = createFastContext({ count: 0 });

function CounterValue() {
    const [count] = useStore(state => state.count);

    return <span data-testid="counter-value">{count}</span>;
}

function IncrementButton() {
    const setCount = useSetStore();

    function increment() {
        setCount(prev => ({ count: prev.count + 1 }));
    }

    return <button onClick={increment}>Increment</button>;
}

function Counter() {
    return (
        <>
            <CounterValue />
            <IncrementButton />
        </>
    );
}

describe('the trivial Counter Component test', () => {
    it('should increment: Counter value', async () => {
        const { user } = setup(
            <Provider>
                <Counter />
            </Provider>
        );
        const getCounterValue = () =>
            screen.getByTestId('counter-value')?.textContent;

        expect(getCounterValue()).toBe('0');

        await user.click(screen.getByRole('button', { name: /Increment/i }));

        expect(getCounterValue()).toBe('1');
    });
});
