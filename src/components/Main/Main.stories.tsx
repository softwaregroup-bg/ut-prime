import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Main from './index';

export default {
    title: 'Main',
    component: Main,
    decorators: [withReadme(README)],
    args: {
        state: {
            loader: {
                toJS: () => ({open: false})
            },
            portal: {
                tabs: [{
                    title: 'Tab 1',
                    path: '/tab1',
                    Component() { return <div>tab 1 body</div>; }
                }, {
                    title: 'Tab 2',
                    path: '/tab2',
                    Component() { return <div>tab 2 body</div>; }
                }]
            }
        }
    }
};

export const Basic: React.FC<{}> = () =>
    <Main/>;
