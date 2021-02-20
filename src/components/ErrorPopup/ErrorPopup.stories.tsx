import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import ErrorPopup from './index';

export default {
    title: 'ErrorPopup',
    component: ErrorPopup,
    decorators: [withReadme(README)]
};

const state = {
    errorPopup: {
        open: true
    }
};

export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <ErrorPopup message='Error message'/>
</Wrap>;
