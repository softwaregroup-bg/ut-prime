import React from 'react';
import type { Meta } from '@storybook/react';

import page from './README.mdx';
import Login from './index';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'Login',
    component: Login,
    parameters: {docs: {page}},
    decorators,
    args: {
        state: {
            login: false
        }
    }
};
export default meta;

const Template: React.FC = () =>
    <div className='flex' style={{height: 600}}>
        <Login />
    </div>;

export const Basic = Template.bind({});
export const BasicAR = Template.bind({});
BasicAR.args = {lang: 'ar', dir: 'rtl'};
