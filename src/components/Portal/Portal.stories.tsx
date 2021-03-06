import React from 'react';
import type { Story, Meta } from '@storybook/react';

import page from './README.mdx';
import type { Props } from './Portal.types';
import Portal from './index';
import Explorer from '../Explorer';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'Portal',
    component: Portal,
    parameters: {docs: {page}},
    decorators,
    args: {
        state: {}
    }
};
export default meta;

const Template: Story<Props & {state: object}> = ({state, ...args}) => <Portal {...args} />;

export const Basic: Story<Props> = Template.bind({});
Basic.args = {
    state: {
        portal: {
            tabs: [{
                title: 'Tab 1',
                path: '/tab1',
                Component() {
                    return (
                        <Explorer
                            fetch={() => Promise.resolve({
                                items: Array.from(Array(50).keys()).map(number => ({
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
};

export const ErrorTab: Story<Props> = Template.bind({});
ErrorTab.args = {
    state: {
        portal: {
            tabs: [{
                title: 'Error',
                path: '/error',
                Component() {
                    throw new Error('Error message');
                }
            }]
        }
    }
};
