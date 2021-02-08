import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import Portal from './index';

export default {
    title: 'Portal',
    component: Portal,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Portal onClick={action('clicked')}>Hello Portal</Portal>;
