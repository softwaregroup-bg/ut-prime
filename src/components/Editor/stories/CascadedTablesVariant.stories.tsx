import React from 'react';
import type { Story } from '@storybook/react';
import type { Props } from '../Editor.types';
import Editor from '..';
import useToast from '../../hooks/useToast';

export { default } from '../Editor.stories';

const Template: Story<Props> = ({...args}) => {
    const {toast, submit} = useToast();
    return <>
        <Editor
            id={1}
            onGet={() =>
                Promise.resolve({
                    roleCategory: [
                        {actionCategoryId: 478, label: 'Manage Users', hasSettings: true},
                        {actionCategoryId: 681, label: 'Manage History', hasSettings: false},
                        {actionCategoryId: 259, label: 'Manage Content Items and Translations', hasSettings: false}
                    ],
                    permission: [
                        {actionCategoryId: 259, actionId: 1006, actionName: 'Add Item', hasRight: true, isOwn: false, objectIds: null },
                        {actionCategoryId: 259, actionId: 1025, actionName: 'Edit Item', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 259, actionId: 1029, actionName: 'Enable / Disable Item', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 259, actionId: 1032, actionName: 'List Items', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 259, actionId: 1047, actionName: 'Upload Items', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 259, actionId: 1052, actionName: 'View Item', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 478, actionId: 1008, actionName: 'Add User', hasRight: true, isOwn: true, objectIds: [1167, 1168, 1169]},
                        {actionCategoryId: 478, actionId: 1011, actionName: 'Authorize Changes (Approve/Reject)', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 478, actionId: 1014, actionName: 'Clear Unsuccessful Login Attempts', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 478, actionId: 1020, actionName: 'Delete User', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 478, actionId: 1028, actionName: 'Edit User', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 478, actionId: 1101, actionName: 'List Users', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 478, actionId: 1035, actionName: 'Lock / Unlock User', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 478, actionId: 1055, actionName: 'View User', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 681, actionId: 1109, actionName: 'Access Policy History Log', hasRight: true, isOwn: false, objectIds: [1173, 1171]},
                        {actionCategoryId: 681, actionId: 1074, actionName: 'Agents and Merchants Network History Log', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 681, actionId: 1144, actionName: 'Business Unit History Log', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 681, actionId: 1150, actionName: 'Export History', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 681, actionId: 1092, actionName: 'KYC History Log', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 681, actionId: 1065, actionName: 'Role History Log', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 681, actionId: 1136, actionName: 'Rule History Log', hasRight: false, isOwn: false, objectIds: null},
                        {actionCategoryId: 681, actionId: 1066, actionName: 'User History Log', hasRight: true, isOwn: false, objectIds: null}
                    ],
                    permissionRole: [
                        { actionId: 1008, value: 1167, selected: true, label: 'Banks Branch User', description: 'Banks Branch User' },
                        { actionId: 1008, value: 1168, selected: true, label: 'CBI Admin', description: 'CBI Admin' },
                        { actionId: 1008, value: 1169, selected: true, label: 'CBI Auditor', description: 'CBI Auditor' },
                        { actionId: 1008, value: 1170, selected: false, label: 'CBI Compliance Office User', description: 'CBI Compliance Office User' },
                        { actionId: 1066, value: 1171, selected: true, label: 'CBI Directorate Admin Checker', description: 'CBI Directorate Admin Checker' },
                        { actionId: 1066, value: 1172, selected: false, label: 'CBI Directorate Admin Maker', description: 'CBI Directorate Admin Maker' },
                        { actionId: 1066, value: 1173, selected: true, label: 'CBI IT Admin Checker', description: 'CBI IT Admin Checker' },
                        { actionId: 1009, value: 1164, selected: false, label: 'Bank Admin Checker', description: 'Bank Admin Checker' },
                        { actionId: 1109, value: 1165, selected: false, label: 'Bank Admin Maker', description: 'Bank Admin Maker' },
                        { actionId: 1109, value: 1166, selected: false, label: 'Bank User', description: 'Bank User' }
                    ],
                    document: [
                        {documentId: 1, documentTypeId: 1, documentType: 'Passport', check: true},
                        {documentId: 2, documentTypeId: 2, documentType: 'Driving License', check: false},
                        {documentId: 3, documentTypeId: 3, documentType: 'Marriage Certificate', check: true},
                        {documentId: 4, documentTypeId: 1, documentType: 'Passport', check: false},
                        {documentId: 5, personId: 2, documentTypeId: 2, documentType: 'Driving License', check: true}
                    ].map(item => ({...item, issueDate: '2020-01-0' + item.documentId, expiryDate: '2025-01-0' + item.documentId}))
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
                    ],
                    documentType: [
                        {value: 1, label: 'Passport'},
                        {value: 2, label: 'Driving License'},
                        {value: 3, label: 'Marriage Certificate'}
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
                            title: ' ',
                            widget: {
                                column: {
                                    className: 'w-1'
                                },
                                type: 'boolean',
                                inlineEdit: true
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
                    hidden: ['actionCategoryId', 'actionId', 'isOwn', 'objectIds'],
                    widgets: ['actionName', 'hasRight'],
                    parent: '$.selected.roleCategory',
                    master: {
                        actionCategoryId: 'actionCategoryId'
                    }
                }
            },
            permissionRole: {
                title: '',
                items: {
                    type: 'object',
                    properties: {
                        actionId: {},
                        selected: {
                            title: ' ',
                            widget: {
                                column: {
                                    className: 'w-1'
                                },
                                type: 'boolean',
                                inlineEdit: true
                            }
                        },
                        value: {},
                        label: {
                            title: 'Permissions for Role'
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
                    },
                    hidden: ['actionId', 'value'],
                    widgets: ['selected', 'label'],
                    parent: '$.selected.permission',
                    master: {
                        actionId: 'actionId'
                    }
                }
            },
            document: {
                type: 'array',
                items: {
                    properties: {
                        documentTypeId: {
                            body: 'documentType',
                            widget: {
                                type: 'dropdown',
                                dropdown: 'documentType',
                                inlineEdit: true,
                                showClear: false
                            }
                        },
                        check: {
                            widget: {
                                column: {
                                    className: 'w-1'
                                },
                                type: 'boolean',
                                inlineEdit: true
                            }
                        },
                        issueDate: {format: 'date'},
                        expiryDate: {
                            format: 'date',
                            widget: {
                                inlineEdit: true,
                                showClear: false
                            }
                        }
                    }
                },
                title: '',
                widget: {
                    actions: {
                        allowEdit: false
                    },
                    type: 'table',
                    autoSelect: true,
                    selectionMode: 'single'
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
                hidden: ['actionCategoryId', 'actionId', 'actionName', 'hasRight', 'isOwn'],
                widgets: ['hasRight', 'actionName']
            }]
        },
        permissionRole: {
            className: 'md:col-8 lg:col-4 xl:col-3',
            widgets: [{
                name: 'permissionRole',
                hidden: ['actionId', 'value'],
                widgets: ['selected', 'label']
            }],
            enabled: '$.selected.permission.hasRight'
        },
        document: {
            label: 'Document',
            widgets: [{
                name: 'document',
                hidden: ['documentId'],
                widgets: ['documentTypeId', 'issueDate', 'expiryDate', 'check']
            }]
        }
    },
    layouts: {
        edit: [
            { id: 'permission', label: 'Permission settings', widgets: ['roleCategory', 'permission', 'permissionRole'] },
            { id: 'document', label: 'Documents', widgets: ['document'] }
        ]
    }
};
