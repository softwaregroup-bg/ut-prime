import React from 'react';
import type { Meta } from '@storybook/react';

import page from './README.mdx';
import Loader from './index';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'Internal/Loader',
    component: Loader,
    parameters: {docs: {page}},
    decorators,
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
