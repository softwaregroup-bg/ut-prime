module.exports = (componentName) => ({
    content: `import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import ${componentName} from './index';

export default {
    title: '${componentName}',
    component: ${componentName},
    decorators: [withReadme(README)],
};

export const Basic: React.FC<{}> = () => <${componentName} onClick={action('clicked')}>Hello ${componentName}</${componentName}>;
`,
    extension: '.stories.tsx',
});
