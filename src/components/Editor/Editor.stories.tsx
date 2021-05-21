import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Editor from './index';

export default {
    title: 'Editor',
    component: Editor,
    decorators: [withReadme(README)]
};

const state = {
};

export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <Editor fields={[]} cards={[]} />
</Wrap>;
