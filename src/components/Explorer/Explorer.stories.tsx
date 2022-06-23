import React from 'react';
import type { Story, Meta } from '@storybook/react';
import {Toast} from '../prime';

import page from './README.mdx';
import Explorer from './index';
import {fetchItems, updateItems} from './mock';

const meta: Meta = {
    title: 'Explorer',
    component: Explorer,
    parameters: {docs: {page}},
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
    columns = ['name', 'size']
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
            <div style={{height: 500, display: 'flex', flexDirection: 'column'}}>
                <Explorer
                    fetch={fetchItems}
                    keyField='id'
                    resultSet='items'
                    schema={{
                        properties: {
                            name: {
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
                >
                    {children}
                </Explorer>
            </div>
        </>
    );
};

export const Basic = Template.bind({});
Basic.args = {};

export const Children = Template.bind({});
Children.args = {
    ...Basic.args,
    children: <div>Navigation component</div>
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
