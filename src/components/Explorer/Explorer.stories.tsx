import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Explorer from './index';

export default {
    title: 'Explorer',
    component: Explorer,
    decorators: [withReadme(README)]
};

const state = {
};

export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <div style={{height: 500}}>
        <Explorer
            fetch={() => Promise.resolve({
                items: [...Array(50).keys()].map(number => ({
                    id: number,
                    name: `Item ${number}`,
                    size: number * 10
                }))
            })}
            keyField='id'
            resultSet='items'
            fields={[{
                dataField: 'name',
                caption: 'Name'
            }, {
                dataField: 'size',
                caption: 'Size'
            }]}
            details={{
                name: 'Name'
            }}
        >
            <div>Navigation component</div>
        </Explorer>
    </div>
</Wrap>;
