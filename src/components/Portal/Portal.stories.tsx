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
                                page: 'details'
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
                Component() { return <div>tab 2 body</div>; }
            }]
        }
    }
};

export const Editor: Story<Props> = Template.bind({});
Editor.args = {
    state: {
        portal: {
            tabs: [{
                title: 'Editor',
                path: '/editor',
                Component: ({...props}) => <Tabs {...Tabs.args} {...props}/>
            }]
        }
    }
};

export const EditorDesign: Story<Props> = Template.bind({});
EditorDesign.args = {
    state: {
        portal: {
            tabs: [{
                title: 'Editor',
                path: '/editor',
                Component: ({...props}) => <Design {...Design.args} {...props}/>
            }]
        }
    }
};

export const ExplorerTab: Story<Props> = Template.bind({});
ExplorerTab.args = {
    state: {
        portal: {
            tabs: [{
                title: 'Explorer',
                path: '/explorer',
                Component: ({...props}) => <ExplorerDesign {...ExplorerDesign.args} {...props}/>
            }]
        }
    }
};

export const Thumb: Story<Props> = Template.bind({});
Thumb.args = {
    state: {
        portal: {
            tabs: [{
                title: 'Thumb Index',
                path: '/thumb',
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
