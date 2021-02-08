import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import Pages from './index';

export default {
    title: 'Pages',
    component: Pages,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Pages onClick={action('clicked')}>Hello Pages</Pages>;
