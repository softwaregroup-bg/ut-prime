import React from 'react';
import { withReadme } from 'storybook-readme';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import Portal from './index';
import Explorer from '../Explorer';

export default {
    title: 'Portal',
    component: Portal,
    decorators: [withReadme(README)]
};

const state = {
    portal: {
        tabs: [{
            title: 'Tab 1',
            path: '/tab1',
            Component() {
                return (
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
                            field: 'name',
                            title: 'Name'
                        }, {
                            field: 'size',
                            title: 'Size'
                        }]}
                        details={{
                            name: 'Name'
                        }}
                    >
                        <div>Navigation component</div>
                    </Explorer>
                );
            }
        }, {
            title: 'Tab 2',
            path: '/tab2',
            Component() { return <div>tab 2 body</div>; }
        }]
    }
};

export const Basic: React.FC<{}> = () => <Wrap state={state}>
    <Portal />
</Wrap>;
