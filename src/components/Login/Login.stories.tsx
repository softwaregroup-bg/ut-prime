import React from 'react';
import type { Meta } from '@storybook/react';

// @ts-ignore: md file and not a module
import page from './README.mdx';
import Login from './index';

const meta: Meta = {
    title: 'Login',
    component: Login,
    parameters: {docs: {page}},
    args: {
        state: {
            login: false
        }
    }
};
export default meta;

export const Basic: React.FC<{}> = () =>
    <div className='flex' style={{height: 600}}>
        <Login />
    </div>;
