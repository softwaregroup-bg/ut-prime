import type {Schema, Cards, Properties} from '../types';

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
            toolbar: [{
                type: 'button',
                title: 'Submit',
                enabled: 'current',
                method: 'table.row.process'
            }, {
                type: 'submit',
                title: 'Action',
                enabled: 'selected',
                action: 'table.row.process'
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
