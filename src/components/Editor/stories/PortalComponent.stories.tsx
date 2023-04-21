import React from 'react';
import type { Story } from '@storybook/react';

import meta from '../Editor.stories';
import Explorer from '../../Explorer';
import {fetchItems} from '../../Explorer/mock';
import Editor from '..';
import type { Props } from '../Editor.types';

export default meta;

declare type StoryTemplate = Story;

const Template: Story<Props> = args => <Editor {...args} />;

export const PortalComponent: StoryTemplate = Template.bind({});
PortalComponent.args = {
    id: 1,
    middleware: [
        _store => next => action => (action.type === 'portal.component.get' && action.page === 'portal.explorer')
            ? Promise.resolve(function ExplorerWidget(props) {
                return <Explorer
                    fetch={fetchItems}
                    keyField='id'
                    resultSet='items'
                    name='items'
                    schema={{
                        properties: {
                            id: {
                            },
                            name: {
                                title: 'Name',
                                filter: true,
                                sort: true
                            }
                        }
                    }}
                    filter={{}}
                    cards={{
                        basic: {
                            widgets: ['name', 'size']
                        }
                    }}
                    layouts={{
                        basic: {
                            columns: 'basic'
                        }
                    }}
                    layout='basic'
                    {...props}
                />;
            })
            : next(action)
    ],
    onGet: () => Promise.resolve({
        explorer: {
            id: 3
        },
        multiselect: {
            selected: [{
                id: 3
            }, {
                id: 5
            }]
        }
    }),
    onDropdown: names => Promise.resolve({}),
    schema: {
        properties: {
            explorer: {
                widget: {
                    type: 'page',
                    page: 'portal.explorer',
                    table: {
                        selectionMode: 'single'
                    }
                }
            },
            multiselect: {
                widget: {
                    type: 'page',
                    page: 'portal.explorer'
                }
            }
        }
    },
    cards: {
        explorer: {
            widgets: ['explorer']
        },
        multiselect: {
            widgets: ['multiselect']
        }
    },
    layouts: {
        edit: ['explorer', 'multiselect']
    }
};
