import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import Main from './index';

export default {
    title: 'Main',
    component: Main,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Main onClick={action('clicked')}>Hello Main</Main>;
