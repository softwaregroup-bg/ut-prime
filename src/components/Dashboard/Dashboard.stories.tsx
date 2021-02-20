import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Dashboard from './index';

export default {
    title: 'Dashboard',
    component: Dashboard,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Wrap>
    <Dashboard tabName='Dashboard'>
        Dashboard body
    </Dashboard>;
</Wrap>;
