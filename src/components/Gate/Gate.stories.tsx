import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Gate from './index';

export default {
    title: 'Gate',
    component: Gate,
    decorators: [withReadme(README)]
};

const state = {
    login: {
        get: item => ({
            cookieChecked: true,
            authenticated: true,
            result: {
                getIn: () => {}
            }
        }[item])
    }
};

export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <Gate>Gate body</Gate>
</Wrap>;
