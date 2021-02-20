import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Loader from './index';

export default {
    title: 'Loader',
    component: Loader,
    decorators: [withReadme(README)]
};

const state = {
    preloadWindow: {
        toJS: () => ({open: true})
    }
};

export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <Loader>Hello Loader</Loader>
</Wrap>;
