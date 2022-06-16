import React from 'react';
import type { Meta } from '@storybook/react';

import page from './README.mdx';
import App from './index';
import state from '../test/state';

const meta: Meta = {
    title: 'App',
    component: App,
    parameters: {docs: {page}}
};
export default meta;

export const Basic: React.FC<object> = ({children}) => {
    return <App
        portalName='test app'
        state={state}
        theme={{
            ut: {
                classes: {}
            },
            palette: {
                type: 'dark-compact'
            }
        }}
    >
        {children}
    </App>;
};
