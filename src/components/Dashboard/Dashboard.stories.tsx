import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Dashboard from './index';

export default {
    title: 'Dashboard',
    component: Dashboard,
    decorators: [withReadme(README)],
    args: {
        state: {}
    }
};

export const Basic: React.FC<{}> = () =>
    <Dashboard tabName='Dashboard'>
        Dashboard body
    </Dashboard>;
