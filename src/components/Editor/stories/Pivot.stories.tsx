import React from 'react';
import Editor from '..';
export {default} from '../Editor.stories';

export const Pivot = () =>
    <Editor
        id={1}
        onGet={() => Promise.resolve({
            schedule: [
                {weekdayName: 'Tuesday', startTime: '16:00', endTime: '17:00'},
                {weekdayName: 'Friday', startTime: '09:00', endTime: '10:00'}
            ],
            permission: [
                {entityId: 1, entityName: 'Organization', create: true, edit: true},
                {entityId: 2, entityName: 'Role', view: true},
                {entityId: 3, entityName: 'User', view: true, create: true, edit: true, delete: true}
            ]
        })}
        onDropdown={() => Promise.resolve({
            entity: [
                {value: 1, label: 'Organization'},
                {value: 2, label: 'Role'},
                {value: 3, label: 'User'},
                {value: 4, label: 'Product'},
                {value: 5, label: 'Account'}
            ]
        })}
        schema={{
            type: 'object',
            properties: {
                schedule: {
                    title: '',
                    items: {
                        type: 'object',
                        properties: {
                            weekdayName: {readOnly: true},
                            startTime: {},
                            endTime: {}
                        }
                    },
                    widget: {
                        type: 'table',
                        pivot: {
                            join: {
                                weekdayName: 'weekdayName'
                            },
                            examples: [
                                {weekdayName: 'Monday'},
                                {weekdayName: 'Tuesday'},
                                {weekdayName: 'Wednesday'},
                                {weekdayName: 'Thursday'},
                                {weekdayName: 'Friday'},
                                {weekdayName: 'Saturday'},
                                {weekdayName: 'Sunday'}
                            ]
                        },
                        selectionMode: 'single',
                        actions: {
                            allowAdd: false,
                            allowDelete: false
                        }
                    }
                },
                permission: {
                    title: '',
                    items: {
                        type: 'object',
                        properties: {
                            entityId: {},
                            entityName: {readOnly: true},
                            view: {type: 'boolean'},
                            create: {type: 'boolean'},
                            edit: {type: 'boolean'},
                            delete: {type: 'boolean'}
                        }
                    },
                    widget: {
                        type: 'table',
                        pivot: {
                            dropdown: 'entity',
                            join: {
                                value: 'entityId',
                                label: 'entityName'
                            }
                        },
                        selectionMode: 'single',
                        actions: {
                            allowAdd: false,
                            allowDelete: false
                        }
                    }
                }
            }

        }}
        cards={{
            schedule: {
                label: 'Schedule (static pivot)',
                widgets: [{
                    name: 'schedule',
                    widgets: ['weekdayName', 'startTime', 'endTime']
                }]
            },
            permission: {
                label: 'Permission (dynamic pivot)',
                widgets: [{
                    name: 'permission',
                    widgets: ['entityName', 'view', 'create', 'edit', 'delete']
                }]
            }
        }}
        layouts={{
            edit: ['schedule', 'permission']
        }}
    />;
