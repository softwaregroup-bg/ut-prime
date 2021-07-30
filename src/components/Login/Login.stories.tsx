import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Login from './index';

export default {
    title: 'Login',
    component: Login,
    decorators: [withReadme(README)],
    args: {
        state: {
            login: false
        }
    }
};

export const Basic: React.FC<{}> = () =>
    <Login />;
