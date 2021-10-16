import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Portal from './index';
import Explorer from '../Explorer';

export default {
    title: 'Portal',
    component: Portal,
    decorators: [withReadme(README)],
    args: {
        state: {
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
                                schema={{
                                    properties: {
                                        name: {
                                            title: 'Name'
                                        },
                                        size: {
                                            title: 'Size'
                                        }
                                    }
                                }}
                                columns = {['name', 'size']}
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
        }
    }
};

export const Basic: React.FC<{}> = () => <Portal />;
