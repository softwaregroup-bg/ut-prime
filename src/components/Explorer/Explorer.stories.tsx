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
const filteredItems = (filters) => {
    return Object.entries(filters).reduce((items, [key, value]) => {
        return items.filter(i => {
            return i[key] === value || (typeof value === 'string' && i[key].toString().startsWith(value));
        });
    }, [...Array(50).keys()].map(number => ({
        id: number,
        name: `Item ${number}`,
        size: number * 10
    })));
};
export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <div style={{height: 500, display: 'flex', flexDirection: 'column'}}>
        <Explorer
            fetch={(filters) => Promise.resolve({
                items: filteredItems(filters)
            })}
            keyField='id'
            resultSet='items'
            fields={[{
                field: 'name',
                title: 'Name',
                filter: true
            }, {
                field: 'size',
                title: 'Size',
                filter: true
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
