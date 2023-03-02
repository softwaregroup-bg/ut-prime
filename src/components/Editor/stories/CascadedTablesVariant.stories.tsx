import React from 'react';
import type { Story } from '@storybook/react';
import type { Props } from '../Editor.types';
import Editor from '..';
import useToast from '../../hooks/useToast';

export { default } from '../Editor.stories';

// export const CascadedTablesVariant = () => {
const Template: Story<Props> = ({...args}) => {
    const {toast, submit} = useToast();
    return <>
        <Editor
            id={1}
            onGet={() =>
                Promise.resolve({
                    roleCategory: [
                        {actionCategoryId: 269, label: 'Manage Content Items and Translations', hasSettings: false},
                        {actionCategoryId: 885, label: 'Manage Users', hasSettings: true},
                        {actionCategoryId: 1886, label: 'Manage History', hasSettings: true}
                    ],
                    permission: [
                        { actionId: 1006, actionName: 'Add Item', actionCategoryId: 269, hasRight: true, isOwn: false, objectIds: null },
                        { actionId: 1008, actionName: 'Add User', actionCategoryId: 885, hasRight: true, isOwn: false, objectIds: null },
                        { actionId: 1106, actionName: 'List Users', actionCategoryId: 885, hasRight: false, isOwn: false, objectIds: null },
                        { actionId: 1069, actionName: 'User History Log', actionCategoryId: 1886, hasRight: true, isOwn: false, objectIds: null },
                        { actionId: 1121, actionName: 'Access Policy History Log', actionCategoryId: 1886, hasRight: true, isOwn: false, objectIds: '1170,1171' }
                    ],
                    permissionRole: [
                        { actionId: 1121, value: 1164 },
                        { actionId: 1121, value: 1165 },
                        { actionId: 1121, value: 1166 },
                        { actionId: 1008, value: 1167 },
                        { actionId: 1008, value: 1168 },
                        { actionId: 1008, value: 1169 },
                        { actionId: 1008, value: 1170 },
                        { actionId: 1069, value: 1171 },
                        { actionId: 1069, value: 1172 },
                        { actionId: 1069, value: 1173 }
                    ]
                })
            }
            onDropdown={() =>
                Promise.resolve({
                    permissionRole: [
                        { value: 1164, label: 'Bank Admin Checker', description: 'Bank Admin Checker' },
                        { value: 1165, label: 'Bank Admin Maker', description: 'Bank Admin Maker' },
                        { value: 1166, label: 'Bank User', description: 'Bank User' },
                        { value: 1167, label: 'Banks Branch User', description: 'Banks Branch User' },
                        { value: 1168, label: 'CBI Admin', description: 'CBI Admin' },
                        { value: 1169, label: 'CBI Auditor', description: 'CBI Auditor' },
                        { value: 1170, label: 'CBI Compliance Office User', description: 'CBI Compliance Office User' },
                        { value: 1171, label: 'CBI Directorate Admin Checker', description: 'CBI Directorate Admin Checker' },
                        { value: 1172, label: 'CBI Directorate Admin Maker', description: 'CBI Directorate Admin Maker' },
                        { value: 1173, label: 'CBI IT Admin Checker', description: 'CBI IT Admin Checker' },
                        { value: 1174, label: 'CBI IT Admin Maker', description: 'CBI IT Admin Maker' },
                        { value: 1175, label: 'CBI System User', description: 'CBI System User' },
                        { value: 1176, label: 'CSW Admin Maker', description: 'CSW Admin Maker' },
                        { value: 1177, label: 'EXC Admin Checker', description: 'EXC Admin Checker' },
                        { value: 1178, label: 'EXC Admin Maker', description: 'EXC Admin Maker' },
                        { value: 1179, label: 'EXC Branch User', description: 'EXC Branch User' },
                        { value: 1180, label: 'EXC User', description: 'EXC User' }
                    ]
                })
            }
            onEdit={submit}
            {...args}
        />
        {toast}
    </>;
};

declare type StoryTemplate = Story<Partial<Props>> & {
    play: (context: {canvasElement: HTMLElement}) => Promise<void>
}

export const CascadedTablesVariant: StoryTemplate = Template.bind({});
CascadedTablesVariant.args = {
    schema: {
        type: 'object',
        properties: {
            roleCategory: {
                type: 'array',
                title: '',
                items: {
                    type: 'object',
                    readOnly: true,
                    properties: {
                        actionCategoryId: {},
                        label: {
                            title: 'Category',
                            readOnly: true
                        }
                    }
                },
                widget: {
                    type: 'table',
                    selectionMode: 'single',
                    actions: {
                        allowAdd: false,
                        allowDelete: false,
                        allowEdit: false
                    }
                }
            },
            permission: {
                title: '',
                items: {
                    type: 'object',
                    properties: {
                        actionCategoryId: {},
                        actionId: {},
                        actionName: {
                            title: 'Granted Permissions',
                            readOnly: true
                        },
                        hasRight: {
                            widget: {
                                type: 'boolean'
                            }
                        },
                        isOwn: {
                            widget: {
                                type: 'boolean'
                            }
                        },
                        objectIds: {}
                    }
                },
                widget: {
                    title: 'Granted Permissions',
                    type: 'table',
                    selectionMode: 'single',
                    actions: {
                        allowAdd: false,
                        allowDelete: false,
                        allowEdit: false
                    },
                    hidden: ['actionCategoryId', 'actionId', 'actionName', 'hasRight', 'isOwn', 'objectIds'],
                    widgets: ['actionName', 'hasRight'],
                    parent: '$.selected.roleCategory',
                    master: {
                        actionCategoryId: 'actionCategoryId'
                    }
                }
            },
            permissionRole: {
                title: '',
                // items: {
                //     type: 'object',
                //     properties: {
                //         actionId: {},
                //         objectId: {
                //             title: 'Permissions for Role',
                //             widget: {
                //                 type: 'dropdown',
                //                 dropdown: 'permissionRole'
                //             }
                //         }
                //     }
                // },
                // widget: {
                //     type: 'table',
                //     actions: {
                //         allowAdd: false,
                //         allowDelete: false,
                //         allowEdit: false
                //     },
                //     hidden: ['actionId', 'objectId'],
                //     widgets: ['objectId'],
                //     parent: '$.selected.permission',
                //     master: {
                //         actionId: 'actionId'
                //     }
                // }
                widget: {
                    title: 'Roles for Permission',
                    type: 'selectTable',
                    dropdown: 'permissionRole',
                    parent: '$.selected.permission.actionId'
                }
            }
        }
    },
    cards: {
        roleCategory: {
            className: 'md:col-8 lg:col-4 xl:col-3',
            widgets: [{
                name: 'roleCategory',
                hidden: ['actionCategoryId'],
                widgets: ['label']
            }]
        },
        permission: {
            className: 'md:col-8 lg:col-4 xl:col-3',
            widgets: [{
                name: 'permission',
                hidden: ['actionCategoryId', 'actionId', 'actionName', 'hasRight', 'isOwn', 'objectIds'],
                widgets: ['actionName', 'hasRight']
            }]
        },
        permissionRole: {
            className: 'md:col-8 lg:col-4 xl:col-3',
            widgets: ['permissionRole'],
            enabled: '$.selected.roleCategory.hasSettings'
            // widgets: [{
            //     name: 'permissionRole',
            //     hidden: ['actionId'],
            //     widgets: ['objectId']
            // }]
        }
    },
    layouts: { edit: ['roleCategory', 'permission'] }
};
