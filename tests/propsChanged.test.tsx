import React, { useState } from 'react';
import { createFastContext } from '../src/index';
import { act, render, screen } from './test-utils';

const { Provider: PropsChangeProvider, useStore: usePropsChangeStore } =
    createFastContext<{
        state: any;
    }>({ state: {} }, { updateOnPropsChange: true });

const { Provider, useStore } = createFastContext<{
    state: any;
}>();

describe('Advanced test: Provider options - updateOnPropsChange', () => {
    it('should set Provider store on props change', () => {
        render(<App>{state => <Mock state={state} />}</App>);

        act(() => {
            screen.getByTestId('changeState').click();
        });

        expect(screen.getByTestId('displayState').textContent).toBe('2');
        expect(screen.getByTestId('count').textContent).toBe('2');
    });

    it('should not set  Provider store on props change', () => {
        render(<App>{state => <Mock2 state={state} />}</App>);

        act(() => {
            screen.getByTestId('changeState').click();
        });

        expect(screen.getByTestId('displayState').textContent).toBe('2');
        expect(screen.getByTestId('count').textContent).toBe('1');
    });
});

function App({ children }) {
    const [state, setState] = useState('1');

    function changeState() {
        setState('2');
    }

    return (
        <>
            <button data-testid="changeState" onClick={changeState}>
                Change State
            </button>
            <div data-testid="displayState">{state}</div>
            {children(state)}
        </>
    );
}

function Mock({ state }) {
    return (
        <PropsChangeProvider state={state}>
            <TestComponent />
        </PropsChangeProvider>
    );
}

function Mock2({ state }) {
    return (
        <Provider state={state}>
            <TestComponent2 />
        </Provider>
    );
}

function TestComponent() {
    const [count] = usePropsChangeStore(store => store.state);

    return <div data-testid="count">{count}</div>;
}

function TestComponent2() {
    const [count] = useStore(store => store.state);

    return <div data-testid="count">{count}</div>;
}
