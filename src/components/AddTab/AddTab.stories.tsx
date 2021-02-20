import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import AddTab from './index';

export default {
    title: 'AddTab',
    component: AddTab,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Wrap>
    <AddTab />
</Wrap>;
