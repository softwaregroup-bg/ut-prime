import React from 'react';
import { withReadme } from 'storybook-readme';
import {createStore} from 'redux';

// @ts-ignore: md file and not a module
import README from './README.md';
import App from './index';

export default {
    title: 'App',
    component: App,
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
    },
    tabMenu: {
        tabs: []
    }
};

export const Basic: React.FC<{}> = ({children}) => {
    const store = createStore(() => state);
    return <App
        menu={[]}
        portalName='test app'
        showTab={() => {}}
        store={store}
        theme={{
            ut: {
                classes: {}
            }
        }}
    >
        {children}
    </App>;
};
