import React from 'react';
import { withReadme } from 'storybook-readme';

import store from '../test/store';

// @ts-ignore: md file and not a module
import README from './README.md';
import App from './index';

export default {
    title: 'App',
    component: App,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = ({children}) => {
    return <App
        portalName='test app'
        store={store()}
        theme={{
            ut: {
                classes: {}
            }
        }}
    >
        {children}
    </App>;
};
