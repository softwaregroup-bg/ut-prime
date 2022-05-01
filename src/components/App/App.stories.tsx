import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import App from './index';
import state from '../test/state';

export default {
    title: 'App',
    component: App,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = ({children}) => {
    return <App
        portalName='test app'
        state={state}
        theme={{
            ut: {
                classes: {}
            },
            palette: {
                type: 'dark-compact'
            }
        }}
    >
        {children}
    </App>;
};
