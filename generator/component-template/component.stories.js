module.exports = (componentName) => ({
    content: `import React from 'react';
import type { Story, Meta } from '@storybook/react';

// @ts-ignore: mdx file and not a module
import page from './README.mdx';
import type { Props } from './${componentName}.types';
import ${componentName} from './index';

const meta: Meta = {
    title: '${componentName}',
    component: ${componentName},
    parameters: {docs: {page}},
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
