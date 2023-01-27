import React from 'react';
import { createFastContext } from '@src/index';
import { act, render } from './test-utils';

function setup(initialState, arg: any) {
    const { Provider, useStore } = createFastContext(initialState);
    const returnVal = {};
    function TestComponent() {
        Object.assign(returnVal, useStore(arg));
        return null;
    }
    render(
        <Provider>
            <TestComponent />
        </Provider>
    );
    return returnVal;
}

describe('createFastContext test', () => {
    it('should be Defined: Provider & useStore', () => {
        const { Provider, useStore } = createFastContext({});

        expect(Provider).toBeDefined();
        expect(useStore).toBeDefined();
    });
});

describe('Advanced test: Using components', () => {
    it('should Render component and increment count', () => {
        const data = setup({ count: 0 }, state => state.count);
        // count = data[0] / setStore = data[1]
        const setStore = data[1];

        expect(data[0]).toBe(0);
        expect(setStore).toBeDefined();
        act(() => {
            setStore(prev => ({
                count: prev.count + 1,
            }));
        });

        expect(data[0]).toBe(1);
    });

    it("should Render component and updates user's state", () => {
        const initialState = {
            user: {
                name: 'John',
                isOnline: false,
            },
        };
        const data = setup(initialState, state => state.user);

        const setStore = data[1];

        expect(data[0]).not.toBeNull();
        expect(data[0]).toEqual(initialState.user);

        act(() => {
            setStore(prev => ({
                user: { ...prev.user, isOnline: true },
            }));
        });

        expect(data[0]).toEqual({
            name: 'John',
            isOnline: true,
        });
    });
});
