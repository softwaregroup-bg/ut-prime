import React from 'react';
import type { Story, Meta } from '@storybook/react';
import {Toast} from '../prime';

import page from './README.mdx';
import Explorer from './index';
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
    details?: object,
    children?: React.ReactNode,
    columns?: string[]
}> = ({
    createPermission,
    editPermission,
    deletePermission,
    details,
    children,
    columns = ['name', 'size'],
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
                    columns = {columns}
                    subscribe={updateItems}
                    details={details}
                    filter={{}}
                    toolbar={[{
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
                    }]}
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
    children: Array.from({length: 100}).fill(<div>Navigation component</div>)
};

export const Details = Template.bind({});
Details.args = {
    ...Children.args,
    details: {
        name: 'Name'
    }
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
    columns: ['date', 'time', 'dateTime']
};

export const Grid = Template.bind({});
Grid.args = {
    ...Basic.args,
    cards: {
        grid: {
            type: 'grid',
            widgets: [{
                name: 'name', type: 'label'
            }, {
                name: 'size', type: 'label'
            }]
        }
    },
    pageSize: 36,
    layout: ['grid']
};

export const GridFlex = Template.bind({});
GridFlex.args = {
    ...Basic.args,
    cards: {
        grid: {
            type: 'grid',
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
        }
    },
    pageSize: 24,
    layout: ['grid']
};
