import type {
    Schema,
    Cards,
    Properties
} from '../types';

const properties: Properties = {
    table: {
        title: '',
        items: {
            properties: {
                id: {
                    readOnly: true,
                    filter: true,
                    default: {
                        function: 'max'
                    }
                },
                name: {
                    filter: true
                },
                value: {
                    filter: true
                },
                statusId: {
                    filter: true
                }
            }
        },
        widget: {
            type: 'table',
            additionalButtons: [{
                type: 'button',
                title: 'Archive',
                enabled: 'selected',
                confirm: 'Current document will be archived. Do you confirm this action?',
                onClick: 'handleDocumentArchive',
                icon: 'p-c p-button-icon-left pi pi-inbox'
            }, {
                type: 'submit',
                title: 'Notify',
                confirm: 'This document will be sent as in a message?',
                enabled: 'selected',
                method: 'document.customer.notify',
                icon: 'p-c p-button-icon-left pi pi-send'
            }],
            widgets: ['id', 'name', 'value', 'statusId']
        }
    }
};

export const input: {
    schema: Schema,
    cards: Cards
} = {
    schema: {
        properties: {
            input: {
                properties
            }
        }
    },
    cards: {
        center: {
            widgets: [
                'input.table'
            ]
        }
    }
};

export const dropdowns = {
    dropdown: [
        {value: 1, label: 'EUR'},
        {value: 2, label: 'USD'},
        {value: 3, label: 'BGN'}
    ]
};
