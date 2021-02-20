import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Pages from './index';

export default {
    title: 'Pages',
    component: Pages,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Wrap>
    <Pages tabs={[]} />
</Wrap>;
