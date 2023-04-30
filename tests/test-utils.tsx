/* eslint-disable import/export */
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

interface CustomRenderOptions extends Omit<RenderOptions, 'queries'> {
    // Add any additional options you want to support
}

const AllTheProviders = ({ children }) => {
    return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: CustomRenderOptions) =>
    render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

type SetupResult = ReturnType<typeof customRender> & {
    user: ReturnType<typeof userEvent.setup>;
};

export function setup(jsx: ReactElement): SetupResult {
    return {
        user: userEvent.setup(),
        ...customRender(jsx),
    };
}
