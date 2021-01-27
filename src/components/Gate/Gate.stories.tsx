import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import Gate from './index';

export default {
    title: 'Gate',
    component: Gate,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Gate onClick={action('clicked')}>Hello Gate</Gate>;
