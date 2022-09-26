import React from 'react';
import type { Story, Meta } from '@storybook/react';

import page from './README.mdx';
import type { Props } from './ScrollBox.types';
import ScrollBox from './index';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'ScrollBox',
    component: ScrollBox,
    parameters: {docs: {page}},
    decorators,
    args: {
        state: {}
    }
};
export default meta;

declare type StoryTemplate = Story<Partial<Props>> & {
    play: (context: {canvasElement: HTMLElement}) => Promise<void>
}

const Template: Story<Props> = args => <ScrollBox {...args}>
    <h1>Line 01</h1>
    <h1>Line 02</h1>
    <h1>Line 03</h1>
    <h1>Line 04</h1>
    <h1>Line 05</h1>
    <h1>Line 06</h1>
    <h1>Line 07</h1>
    <h1>Line 08</h1>
    <h1>Line 09</h1>
    <h1>Line 10</h1>
    <h1>Line 11</h1>
    <h1>Line 12</h1>
    <h1>Line 13</h1>
    <h1>Line 14</h1>
    <h1>Line 15</h1>
    <h1>Line 16</h1>
    <h1>Line 17</h1>
    <h1>Line 18</h1>
    <h1>Line 19</h1>
</ScrollBox>;

export const Basic: StoryTemplate = Template.bind({});
Basic.args = {
    className: 'col-2 p-component'
};
