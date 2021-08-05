module.exports = (componentName) => ({
    content: `import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import ${componentName} from './index';

export default {
    title: '${componentName}',
    component: ${componentName},
    decorators: [withReadme(README)]
};

const state = {
};

export const Basic: React.FC<{}> = () =>  <${componentName} />;
`,
    extension: '.stories.tsx'
});
