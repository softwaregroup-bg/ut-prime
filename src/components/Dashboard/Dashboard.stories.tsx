import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import Dashboard from './index';

export default {
    title: 'Dashboard',
    component: Dashboard,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Dashboard onClick={action('clicked')}>Hello Dashboard</Dashboard>;
