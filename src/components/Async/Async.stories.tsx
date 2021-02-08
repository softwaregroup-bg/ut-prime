import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import Async from './index';

export default {
    title: 'Async',
    component: Async,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Async onClick={action('clicked')}>Hello Async</Async>;
