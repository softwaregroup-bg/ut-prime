import React from 'react';
import { withReadme } from 'storybook-readme';
import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Explorer from './index';
import {fetchItems} from './mock';

export default {
    title: 'Explorer',
    component: Explorer,
    decorators: [withReadme(README)]
};

const state = {
};
export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <div style={{height: 500, display: 'flex', flexDirection: 'column'}}>
        <Explorer
            fetch={fetchItems}
            keyField='id'
            resultSet='items'
            fields={[{
                field: 'name',
                title: 'Name',
                filter: true,
                sort: true
            }, {
                field: 'size',
                title: 'Size',
                filter: true,
                sort: true
            }]}
            details={{
                name: 'Name'
            }}
            filter={{}}
        >
            <div>Navigation component</div>
        </Explorer>
    </div>
</Wrap>;
