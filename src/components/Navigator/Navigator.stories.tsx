import React from 'react';
import type { Meta } from '@storybook/react';

// @ts-ignore: md file and not a module
import page from './README.mdx';
import Navigator from './index';

const meta: Meta = {
    title: 'Navigator',
    component: Navigator,
    parameters: {docs: {page}}
};
export default meta;

export const Basic: React.FC<{}> = () =>
    <div style={{height: 500}}>
        <Navigator
            fetch={() => Promise.resolve({
                items: [...Array(50).keys()].map(number => ({
                    id: String(number),
                    name: `Item ${number}`,
                    parent: number >= 10 ? String(number % 10) : undefined
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
