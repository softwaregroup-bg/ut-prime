import React from 'react';
import type { Story, Meta } from '@storybook/react';

import page from './README.mdx';
import type { Props } from './Portal.types';
import Portal from './index';
import Explorer from '../Explorer';
import decorators from '../test/decorator';

import { Tabs, Design } from '../Editor/Editor.stories';
import {Design as ExplorerDesign} from '../Explorer/Explorer.stories';
import {Basic as ThumbIndex} from '../ThumbIndex/ThumbIndex.stories';

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
                Component({...props}) {
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
                            cards = {{
                                browse: {
                                    widgets: ['name', 'size']
                                }
                            }}
                            details={{
                                name: 'Name'
                            }}
                            {...props}
                        >
                            <div>Navigation component</div>
                        </Explorer>
                    );
                }
            }, {
                title: 'Tab 2',
                path: '/tab2',
                Component: ({...props}) => <Tabs {...Tabs.args} {...props}/>
            }, {
                title: 'Tab 3',
                path: '/tab3',
                Component: ({...props}) => <Design {...Design.args} {...props}/>
            }, {
                title: 'Tab 4',
                path: '/tab4',
                Component: ({...props}) => <ExplorerDesign {...ExplorerDesign.args} {...props}/>
            }, {
                title: 'Tab 5',
                path: '/tab5',
                Component: ({...props}) => <ThumbIndex {...props}/>
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
                    throw new Error('This is intentional error message');
                }
            }]
        }
    }
};
