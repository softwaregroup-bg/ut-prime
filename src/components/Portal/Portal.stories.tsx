import React from 'react';
import { withReadme } from 'storybook-readme';
import type { Story, Meta } from '@storybook/react';

// @ts-ignore: md file and not a module
import README from './README.md';
import Portal from './index';
import type { Props } from './Portal.types';
import Explorer from '../Explorer';

const meta: Meta = {
    title: 'Portal',
    component: Portal,
    decorators: [withReadme(README)],
    args: {
        state: {}
    }
};
export default meta;

const Template: Story<Props & {state: {}}> = ({state, ...args}) => <Portal {...args} />;

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
