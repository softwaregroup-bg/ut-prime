import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Navigator from './index';

export default {
    title: 'Navigator',
    component: Navigator,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () =>
    <div style={{height: 500}}>
        <Navigator
            fetch={() => Promise.resolve({
                items: [...Array(50).keys()].map(number => ({
                    id: String(number),
                    name: `Item ${number}`,
                    parents: number >= 10 ? String(number % 10) : undefined
                }))
            })}
            keyField='id'
            resultSet='items'
            field='name'
            title='Name'
        >
            <div>Navigation component</div>
        </Navigator>
    </div>;
