module.exports = (componentName) => ({
    content: `import React from 'react';
import type { Story, Meta } from '@storybook/react';

import page from './README.mdx';
import type { Props } from './${componentName}.types';
import ${componentName} from './index';
import decorators from '../test/decorator';

const meta: Meta = {
    title: '${componentName}',
    component: ${componentName},
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

const Template: Story<Props> = args => <${componentName} {...args} />;

export const Basic: StoryTemplate = Template.bind({});
Basic.args = {};
`,
    extension: '.stories.tsx'
});
