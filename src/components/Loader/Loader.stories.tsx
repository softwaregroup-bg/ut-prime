import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import Loader from './index';

export default {
    title: 'Loader',
    component: Loader,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Loader onClick={action('clicked')}>Hello Loader</Loader>;
