import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Login from './index';

export default {
    title: 'Login',
    component: Login,
    decorators: [withReadme(README)]
};

const state = {
    login: {
        get: () => false
    }
};

export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <Login />
</Wrap>;
