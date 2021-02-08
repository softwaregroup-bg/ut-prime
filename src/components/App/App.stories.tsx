import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import App from './index';

export default {
    title: 'App',
    component: App,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <App onClick={action('clicked')}>Hello App</App>;
