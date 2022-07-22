import React from 'react';
import type { Story, Meta } from '@storybook/react';

import page from './README.mdx';
import Permission from './index';
import type { Props } from './Permission.types';

import state from '../test/state';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'Permission',
    component: Permission,
    parameters: {docs: {page}},
    decorators,
    args: {
        state
    }
};
export default meta;

declare type StoryTemplate = Story<Partial<Props>> & {
    play: (context: {canvasElement: HTMLElement}) => Promise<void>
}

const Template: Story<Props & {state: object}> = ({state, ...args}) =>
    <Permission {...args}>
        <div className='p-component'>
            Permissions checked: {String(args.permission)}
        </div>
    </Permission>;

export const Basic: StoryTemplate = Template.bind({});
Basic.args = {
    permission: undefined
};

export const Granted: StoryTemplate = Template.bind({});
Granted.args = {
    ...Basic.args,
    permission: 'granted'
};

export const Multiple: StoryTemplate = Template.bind({});
Multiple.args = {
    ...Basic.args,
    permission: ['granted', 'pageXYZ']
};

export const Wildcard: StoryTemplate = Template.bind({});
Wildcard.args = {
    ...Basic.args,
    permission: 'pageXYZ'
};

export const Denied: StoryTemplate = Template.bind({});
Denied.args = {
    ...Basic.args,
    permission: 'denied'
};

export const AnyDenied: StoryTemplate = Template.bind({});
AnyDenied.args = {
    ...Basic.args,
    permission: ['denied', 'granted']
};
