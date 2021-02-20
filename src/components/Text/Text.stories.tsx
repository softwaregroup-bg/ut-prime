import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Text from './index';

export default {
    title: 'Text',
    component: Text,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Wrap>
    <Text>Text content, which can be translated</Text>
</Wrap>;
