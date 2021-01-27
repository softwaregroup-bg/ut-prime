import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import Text from './index';

export default {
    title: 'Text',
    component: Text,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <Text onClick={action('clicked')}>Hello Text</Text>;
