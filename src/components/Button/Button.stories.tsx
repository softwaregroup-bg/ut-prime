import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import Button from './index';

export default {
    title: 'Button',
    component: Button,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Button onClick={action('clicked')}>Hello Button</Button>;
