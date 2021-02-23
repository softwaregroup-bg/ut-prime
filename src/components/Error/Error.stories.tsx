import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Error from './index';

export default {
    title: 'Error',
    component: Error,
    decorators: [withReadme(README)]
};

const state = {
    error: {
        open: true
    }
};

export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <Error message='Error message'/>
</Wrap>;
