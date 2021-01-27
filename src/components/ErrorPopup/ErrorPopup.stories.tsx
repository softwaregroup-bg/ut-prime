import React from 'react';
import { withReadme } from 'storybook-readme';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import README from './README.md';
import ErrorPopup from './index';

export default {
    title: 'ErrorPopup',
    component: ErrorPopup,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () => <ErrorPopup onClick={action('clicked')}>Hello ErrorPopup</ErrorPopup>;
