module.exports = (componentName) => ({
    content: `import React from 'react';
import { withReadme } from 'storybook-readme';
import type { Story, Meta } from '@storybook/react';

// @ts-ignore: md file and not a module
import README from './README.md';
import ${componentName} from './index';
import type { Props } from './${componentName}.types';

const meta: Meta = {
    title: '${componentName}',
    component: ${componentName},
    decorators: [withReadme(README)],
    args: {
        state: {}
    }
};
export default meta;

const Template: Story<Props & {state: {}}> = ({state, ...args}) => <${componentName} {...args} />;

export const Basic: Story<Props> = Template.bind({});
Basic.args = {};
`,
    extension: '.stories.tsx'
});
