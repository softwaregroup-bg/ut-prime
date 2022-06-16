import React from 'react';
import type { Meta } from '@storybook/react';

import page from './README.mdx';
import Main from './index';

const meta: Meta = {
    title: 'Internal/Main',
    component: Main,
    parameters: {docs: {page}},
    args: {
        state: {
            loader: {
                open: false
            },
            portal: {
                tabs: [{
                    title: 'Tab 1',
                    path: '/tab1',
                    Component() { return <div>tab 1 body</div>; }
                }, {
                    title: 'Tab 2',
                    path: '/tab2',
                    Component() { return <div>tab 2 body</div>; }
                }]
            }
        }
    }
};
export default meta;

export const Basic: React.FC = () =>
    <Main/>;
