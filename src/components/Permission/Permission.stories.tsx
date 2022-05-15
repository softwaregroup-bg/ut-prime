import React from 'react';
import type { Story, Meta } from '@storybook/react';

// @ts-ignore: md file and not a module
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

const Template: Story<Props & {state: {}}> = ({state, ...args}) =>
    <Permission {...args}>
        <div className='p-component'>
            Permissions checked: {String(args.permission)}
        </div>
    </Permission>;

export const Basic: Story<Props> = Template.bind({});
Basic.args = {
    permission: undefined
};

export const Granted: Story<Props> = Template.bind({});
Granted.args = {
    ...Basic.args,
    permission: 'granted'
};

export const Multiple: Story<Props> = Template.bind({});
Multiple.args = {
    ...Basic.args,
    permission: ['granted', 'pageXYZ']
};

export const Wildcard: Story<Props> = Template.bind({});
Wildcard.args = {
    ...Basic.args,
    permission: 'pageXYZ'
};

export const Denied: Story<Props> = Template.bind({});
Denied.args = {
    ...Basic.args,
    permission: 'denied'
};

export const AnyDenied: Story<Props> = Template.bind({});
AnyDenied.args = {
    ...Basic.args,
    permission: ['denied', 'granted']
};
