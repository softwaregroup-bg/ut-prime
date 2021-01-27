import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import AddTab from './index';

export default {
    title: 'AddTab',
    component: AddTab,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <AddTab onClick={action('clicked')}>Hello AddTab</AddTab>;
