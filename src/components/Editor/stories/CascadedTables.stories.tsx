import { userEvent, within } from '@storybook/testing-library';
import React from 'react';
import Editor from '..';
export {default} from '../Editor.stories';

export const CascadedTables = () =>
    <Editor
        id = {1}
        onGet={() => Promise.resolve({
            person: [
                {personId: 1, fullName: 'John Doe', birthDate: '2000-01-08', nationalId: '777777777'},
                {personId: 2, fullName: 'Jane Doe', birthDate: '2002-03-18', nationalId: '888888888'}
            ],
            document: [
                {documentId: 1, personId: 1, documentTypeId: 1, documentType: 'Passport'},
                {documentId: 2, personId: 1, documentTypeId: 2, documentType: 'Driving License'},
                {documentId: 3, personId: 1, documentTypeId: 3, documentType: 'Marriage Certificate'},
                {documentId: 4, personId: 2, documentTypeId: 1, documentType: 'Passport'},
                {documentId: 5, personId: 2, documentTypeId: 2, documentType: 'Driving License'}

            ].map(item => ({...item, issueDate: '2020-01-0' + item.documentId, expiryDate: '2025-01-0' + item.documentId})),
            attachment: [
                {attachmentId: 1, documentId: 1, pageNumber: 1, contentType: 'image/jpeg', sizeBytes: 12345},
                {attachmentId: 1, documentId: 1, pageNumber: 2, contentType: 'image/jpeg', sizeBytes: 23456},
                {attachmentId: 1, documentId: 2, pageNumber: 1, contentType: 'image/png', sizeBytes: 33333},
                {attachmentId: 1, documentId: 2, pageNumber: 2, contentType: 'image/png', sizeBytes: 22222}
            ]
        })}
        onDropdown={names => Promise.resolve({
            documentType: [
                {value: 1, label: 'Passport'},
                {value: 2, label: 'Driving License'},
                {value: 3, label: 'Marriage Certificate'}
            ]
        })}
        cards={{
            person: {
                className: 'xl:col-4',
                label: 'Person',
                widgets: [{
                    name: 'person',
                    hidden: ['personId'],
                    widgets: ['fullName', 'nationalId', 'birthDate']
                }]
            },
            document: {
                className: 'xl:col-4',
                label: 'Document',
                widgets: [{
                    name: 'document',
                    hidden: ['documentId', 'personId'],
                    widgets: ['documentTypeId', 'issueDate', 'expiryDate']
                }]
            },
            attachment: {
                className: 'xl:col-4',
                label: 'Attachment',
                widgets: [{
                    name: 'attachment',
                    hidden: ['attachmentId', 'documentId'],
                    widgets: ['pageNumber', 'contentType', 'sizeBytes']
                }]
            }
        }}
        schema={{
            type: 'object',
            properties: {
                person: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            fullName: {},
                            nationalId: {title: 'National ID'},
                            birthDate: {format: 'date'}
                        }
                    },
                    title: '',
                    widget: {
                        type: 'table',
                        selectionMode: 'single'
                    }
                },
                document: {
                    type: 'array',
                    items: {
                        properties: {
                            documentTypeId: {body: 'documentType', widget: {type: 'dropdown', dropdown: 'documentType', inlineEdit: true, showClear: false}},
                            issueDate: {format: 'date'},
                            expiryDate: {format: 'date'}
                        }
                    },
                    title: '',
                    widget: {
                        type: 'table',
                        master: {
                            personId: 'personId'
                        },
                        parent: '$.selected.person',
                        autoSelect: true,
                        selectionMode: 'single'
                    }
                },
                attachment: {
                    type: 'array',
                    items: {
                        properties: {
                            pageNumber: {type: 'integer'},
                            contentType: {},
                            sizeBytes: {type: 'integer', title: 'Size (bytes)'}
                        }
                    },
                    title: '',
                    widget: {
                        type: 'table',
                        master: {
                            documentId: 'documentId'
                        },
                        parent: '$.selected.document',
                        autoSelect: true,
                        selectionMode: 'single'
                    }
                }
            }
        }}
        layouts={{edit: ['person', 'document', 'attachment']}}
    />;

CascadedTables.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    userEvent.click(await canvas.findByText('John Doe'));
    userEvent.click(canvas.getByText('Driving License'));
};
