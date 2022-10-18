import React from 'react';
import type { Story, Meta } from '@storybook/react';
import {Toast} from '../prime';

import page from './README.mdx';
import Explorer from './index';
import Text from '../Text';
import {fetchItems, updateItems} from './mock';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'Explorer',
    component: Explorer,
    parameters: {docs: {page}},
    decorators,
    args: {
        state: {}
    }
};
export default meta;

const Template: Story<{
    createPermission?: string,
    editPermission?: string,
    deletePermission?: string,
    details?: {
        page: string,
        params: unknown
    },
    children?: React.ReactNode,
    layout?: string
}> = ({
    createPermission,
    editPermission,
    deletePermission,
    details,
    children,
    layout = 'basic',
    ...props
}) => {
    const toast = React.useRef(null);
    const show = action => data => toast.current.show({
        severity: 'success',
        summary: 'Submit',
        detail: <pre>{JSON.stringify({action, data}, null, 2)}</pre>
    });
    return (
        <>
            <Toast ref={toast} />
            <div style={{height: 'fit-content', display: 'flex', flexDirection: 'column'}}>
                <Explorer
                    fetch={fetchItems}
                    keyField='id'
                    resultSet='items'
                    name='items'
                    schema={{
                        properties: {
                            id: {
                                action: show('action')
                            },
                            name: {
                                action: show('action'),
                                title: 'Name',
                                filter: true,
                                sort: true
                            },
                            date: {
                                title: 'Date',
                                filter: true,
                                sort: true,
                                format: 'date'
                            },
                            time: {
                                title: 'Time',
                                filter: true,
                                sort: true,
                                format: 'time'
                            },
                            dateTime: {
                                title: 'Date and time',
                                filter: true,
                                sort: true,
                                format: 'date-time'
                            },
                            size: {
                                title: 'Size',
                                filter: true,
                                sort: true
                            }
                        }
                    }}
                    subscribe={updateItems}
                    onCustomization={show('customization')}
                    details={details}
                    filter={{}}
                    cards={{
                        basic: {
                            widgets: ['name', 'size']
                        },
                        dateTime: {
                            widgets: ['date', 'time', 'dateTime']
                        },
                        grid: {
                            widgets: [{
                                name: 'name', type: 'label'
                            }, {
                                name: 'size', type: 'label'
                            }]
                        },
                        gridFlex: {
                            className: 'col-6 md:col-3',
                            classes: {
                                default: {
                                    root: 'grid m-0',
                                    widget: 'text-center col-4 mb-0'
                                }
                            },
                            widgets: [{
                                type: 'icon', title: 'pi-paperclip'
                            }, {
                                name: 'name', type: 'label'
                            }, {
                                name: 'size', type: 'label'
                            }]
                        },
                        toolbar: {
                            widgets: [{
                                title: 'Create',
                                permission: createPermission,
                                action: () => {}
                            }, {
                                title: 'Edit',
                                permission: editPermission,
                                enabled: 'current',
                                action: show('edit')
                            }, {
                                title: 'Delete',
                                permission: deletePermission,
                                enabled: 'selected',
                                action: show('delete')
                            }]
                        }
                    }}
                    layouts={{
                        basic: {
                            columns: 'basic',
                            toolbar: 'toolbar'
                        },
                        dateTime: {
                            columns: 'dateTime',
                            toolbar: 'toolbar'
                        },
                        grid: {
                            layout: ['grid'],
                            toolbar: 'toolbar'
                        },
                        gridFlex: {
                            layout: ['gridFlex'],
                            toolbar: 'toolbar'
                        }
                    }}
                    layout={layout}
                    {...props}
                >
                    {children}
                </Explorer>
            </div>
        </>
    );
};

export const Basic = Template.bind({});
Basic.args = {};

export const Design = Template.bind({});
Design.args = {
    ...Basic.args,
    design: true
};

export const Children = Template.bind({});
Children.args = {
    ...Basic.args,
    children: <div><Text>Navigation component</Text></div>
};

export const Details = Template.bind({});
Details.args = {
    ...Children.args,
    middleware: [
        _store => next => action => (action.type === 'portal.component.get')
            ? Promise.resolve(function Details({value: {preview}}) {
                return <div>
                    <div><Text>Name</Text>: {preview.name}</div>
                    <div><Text>Size</Text>: {preview.size}</div>
                </div>;
            })
            : next(action)
    ],
    table: {selectionMode: 'single'},
    toolbar: false,
    details: {
        page: 'details'
    }
};

export const DetailsAR = Template.bind({});
DetailsAR.args = {
    ...Details.args,
    lang: 'ar',
    dir: 'rtl'
};

export const ActionPermissions = Template.bind({});
ActionPermissions.args = {
    ...Details.args,
    createPermission: 'forbidden',
    editPermission: 'granted',
    deletePermission: 'forbidden'
};

export const DateTimeFilter = Template.bind({});
DateTimeFilter.args = {
    ...Basic.args,
    layout: 'dateTime'
};

export const Grid = Template.bind({});
Grid.args = {
    ...Basic.args,
    pageSize: 36,
    layout: 'grid'
};

export const GridFlex = Template.bind({});
GridFlex.args = {
    ...Basic.args,
    pageSize: 24,
    layout: 'gridFlex'
};
