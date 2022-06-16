import React from 'react';
import type { Meta } from '@storybook/react';

import page from './README.mdx';
import Loader from './index';

const meta: Meta = {
    title: 'Internal/Loader',
    component: Loader,
    parameters: {docs: {page}},
    args: {
        state: {
            loader: {
                open: true,
                message: 'loading ...'
            }
        }
    }
};
export default meta;

export const Basic: React.FC = () =>
    <Loader>Hello Loader</Loader>;
