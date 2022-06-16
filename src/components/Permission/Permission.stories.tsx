import React from 'react';
import type { Story, Meta } from '@storybook/react';

import page from './README.mdx';
import Permission from './index';
import type { Props } from './Permission.types';

import state from '../test/state';

const meta: Meta = {
    title: 'Permission',
    component: Permission,
    parameters: {docs: {page}},
    args: {
        state
    }
};
export default meta;

const Template: Story<Props & {state: object}> = ({state, ...args}) =>
    <Permission {...args}>
        <div className='p-component'>
            Permissions checked: {String(args.permission)}
        </div>
    </Permission>;

export const Basic: Story<Partial<Props>> = Template.bind({});
Basic.args = {
    permission: undefined
};

export const Granted: Story<Partial<Props>> = Template.bind({});
Granted.args = {
    ...Basic.args,
    permission: 'granted'
};

export const Multiple: Story<Partial<Props>> = Template.bind({});
Multiple.args = {
    ...Basic.args,
    permission: ['granted', 'pageXYZ']
};

export const Wildcard: Story<Partial<Props>> = Template.bind({});
Wildcard.args = {
    ...Basic.args,
    permission: 'pageXYZ'
};

export const Denied: Story<Partial<Props>> = Template.bind({});
Denied.args = {
    ...Basic.args,
    permission: 'denied'
};

export const AnyDenied: Story<Partial<Props>> = Template.bind({});
AnyDenied.args = {
    ...Basic.args,
    permission: ['denied', 'granted']
};
