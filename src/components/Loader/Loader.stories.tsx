import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Loader from './index';

export default {
    title: 'Loader',
    component: Loader,
    decorators: [withReadme(README)],
    args: {
        state: {
            loader: {
                open: true,
                message: 'loading ...'
            }
        }
    }
};

export const Basic: React.FC<{}> = () =>
    <Loader>Hello Loader</Loader>;
