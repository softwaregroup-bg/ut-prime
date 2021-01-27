import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import Login from './index';

export default {
    title: 'Login',
    component: Login,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Login onClick={action('clicked')}>Hello Login</Login>;
