import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Navigator from './index';

export default {
    title: 'Navigator',
    component: Navigator,
    decorators: [withReadme(README)]
};

const state = {
};

export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <div style={{height: 500}}>
        <Navigator
            fetch={() => Promise.resolve({
                items: [...Array(50).keys()].map(number => ({
                    id: number,
                    name: `Item ${number}`,
                    parents: number > 10 ? number % 10 : undefined
                }))
            })}
            keyField='id'
            resultSet='items'
            field='name'
            title='Name'
        >
            <div>Navigation component</div>
        </Navigator>
    </div>
</Wrap>;
