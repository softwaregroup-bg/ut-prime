import React from 'react';
import type { Story, Meta } from '@storybook/react';
import merge from 'ut-function.merge';

import page from './README.mdx';
import type { Props } from './Inspector.types';
import Inspector from './index';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'Inspector',
    component: Inspector,
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

const Template: Story<Props> = args => {
    const [value] = React.useState({type: 'object', properties: {}});
    const [override, setOverride] = React.useState({properties: {test: {sort: true}}});
    return <>
        <Inspector {...args} onChange={setOverride} object={override} property='properties.test' className='col-3' />
        <pre>{JSON.stringify(merge({}, value, override), null, 2)}</pre>
    </>;
};

export const Basic: StoryTemplate = Template.bind({});
Basic.args = {};
