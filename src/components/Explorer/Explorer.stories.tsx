import React from 'react';
import type { Story, Meta } from '@storybook/react';

import page from './README.mdx';
import Explorer from './index';
import Text from '../Text';
import {fetchItems, updateItems} from './mock';
import decorators from '../test/decorator';
import useToast from '../hooks/useToast';
import unauthenticated from '../test/unauthenticated';

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
    buttons?: [],
    children?: React.ReactNode,
    layout?: string
}> = ({
    createPermission,
    editPermission,
    deletePermission,
    details,
    children,
    layout = 'basic',
    buttons,
    ...props
}) => {
    const {toast, show, delay, error} = useToast();
    return (
        <>
            <div style={{height: 'fit-content', display: 'flex', flexDirection: 'column'}}>
                <Explorer
                    fetch={fetchItems}
                    keyField='id'
                    resultSet='items'
                    name='items'
                    methods={{
                        async 'portal.customization.get'() {
                            return {};
                        },
                        'explorer.submit': show('submit'),
                        'explorer.submitError': error('submit error'),
                        'explorer.submitDelay': delay
                    }}
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
                    onCustomization={show('onCustomization')}
                    details={details}
                    filter={{}}
                    cards={{
                        basic: {
                            widgets: ['name', 'size']
                        },
                        dateTime: {
                            widgets: ['date', 'time', 'dateTime']
                        },
                        dropdown: {
                            widgets: ['name', {
                                name: 'size',
                                type: 'dropdown',
                                dropdown: 'item.size'
                            }]
                        },
                        grid: {
                            widgets: [{
                                name: 'name', type: 'label', label: ''
                            }, {
                                name: 'size', type: 'label', label: ''
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
                                name: 'name', type: 'label', label: ''
                            }, {
                                name: 'size', type: 'label', label: ''
                            }]
                        },
                        toolbar: {
                            widgets: buttons || [{
                                title: 'Create',
                                permission: createPermission,
                                action: show('create')
                            }, {
                                title: 'Edit',
                                permission: editPermission,
                                enabled: 'current',
                                action: show('edit')
                            }, {
                                title: 'Delete',
                                confirm: 'Do you confirm the deletion of the selected rows ?',
                                permission: deletePermission,
                                enabled: 'selected',
                                action: show('delete')
                            }, {
                                title: 'Review',
                                menu: [{
                                    id: 'reject',
                                    action: show('reject'),
                                    label: 'Reject'
                                }, {
                                    id: 'approve',
                                    action: show('approve'),
                                    label: 'Approve'
                                }, {
                                    action: show('granted'),
                                    id: 'granted',
                                    permission: 'granted',
                                    label: 'Granted'
                                }, {
                                    action: show('forbidden'),
                                    permission: 'forbidden',
                                    label: 'Forbidden'
                                }]
                            }, {
                                title: 'Error',
                                action: error('action error')
                            }, {
                                title: 'Forbidden',
                                menu: [{
                                    action: show('forbidden'),
                                    permission: 'forbidden',
                                    label: 'Forbidden'
                                }]
                            }]
                        }
                    }}
                    layouts={{
                        basic: {
                            columns: 'basic',
                            toolbar: 'toolbar'
                        },
                        dropdown: {
                            columns: 'dropdown',
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
            {toast}
        </>
    );
};

export const Basic = Template.bind({});
Basic.args = {};

export const BasicBG = Template.bind({});
BasicBG.args = {
    ...Basic.args,
    lang: 'bg'
};

export const Loading = Template.bind({});
Loading.args = {
    ...Basic.args,
    fetch: params => new Promise((resolve, reject) => {})
};

export const DropdownError = Template.bind({});
DropdownError.args = {
    ...Basic.args,
    layout: 'dropdown',
    onDropdown: unauthenticated
};

export const GetError = Template.bind({});
GetError.args = {
    ...Basic.args,
    fetch: unauthenticated
};

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
            ? Promise.resolve(function Details({value: {preview: {current, pagination}}}) {
                return <div>
                    <div><Text>Name</Text>: {current?.name}</div>
                    <div><Text>Size</Text>: {current?.size}</div>
                    <div><Text>Records</Text>: {pagination?.recordsTotal}</div>
                </div>;
            })
            : next(action)
    ],
    table: {selectionMode: 'single'},
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

/* eslint-disable no-template-curly-in-string */
export const Submit = Template.bind({});
Submit.args = {
    ...Basic.args,
    buttons: [{
        title: 'Submit id',
        enabled: 'current',
        method: 'explorer.submit',
        params: '${id}'
    }, {
        title: 'Submit current',
        enabled: 'current',
        method: 'explorer.submit',
        params: '${current}'
    }, {
        title: 'Submit selected',
        enabled: 'selected',
        method: 'explorer.submit',
        params: '${selected}'
    }, {
        title: 'Submit template',
        method: 'explorer.submit',
        enabled: 'current',
        params: {
            id: '${id}',
            size: '${current.size}'
        }
    }, {
        title: 'Error',
        type: 'submit',
        method: 'explorer.submitError',
        params: {}
    }, {
        title: 'Delay',
        successHint: 'Done',
        method: 'explorer.submitDelay'
    }]
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
