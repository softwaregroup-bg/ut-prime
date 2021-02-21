import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Main from './index';

export default {
    title: 'Main',
    component: Main,
    decorators: [withReadme(README)]
};

const state = {
    preloadWindow: {
        toJS: () => ({open: false})
    },
    errorPopup: {
        open: false
    },
    login: {
        get: item => ({
            cookieChecked: true,
            authenticated: true,
            result: {
                getIn: () => {}
            }
        }[item])
    },
    portal: {
        tabs: [{
            title: 'Tab 1',
            path: '/tab1',
            component: () => function Component() { return <div>tab 1 body</div>; }
        }, {
            title: 'Tab 2',
            path: '/tab2',
            component: () => function Component() { return <div>tab 2 body</div>; }
        }]
    }
};

export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <Main/>
</Wrap>;
