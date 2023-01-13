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
                confirm: 'Current document will be archived. Do you confirm this action?',
                action: 'handleArchive',
                icon: 'p-c p-button-icon-left pi pi-inbox'
            }, {
                type: 'button',
                title: 'Change name',
                action: 'handleNameChange',
                icon: 'p-c p-button-icon-left pi pi-file'
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
            className: 'xl:col-4',
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
    ]};
