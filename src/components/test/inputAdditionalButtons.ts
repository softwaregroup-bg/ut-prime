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
                action: 'handleArchive',
                icon: 'p-c p-button-icon-left pi pi-inbox',
                params: {
                    columnName: 'name',
                    newValue: 'documentTest123'
                }
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
