/* eslint-disable import/export */
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const AllTheProviders = ({ children }) => {
    return <>{children}</>;
};

const customRender = (ui, options?) =>
    render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

export function setupRender(jsx: React.ReactElement) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    };
}
