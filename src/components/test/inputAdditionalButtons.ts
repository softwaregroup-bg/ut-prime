import type {
    Schema,
    Cards,
    Properties
} from '../types';
import tree from './tree';

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
                type: 'submit',
                title: 'Archive',
                method: 'handleArchive',
                icon: 'p-c p-button-icon-left pi pi-inbox',
                params: {
                    selected: '$.selected'
                }
            }],
            widgets: ['id', 'name', 'value', 'statusId']
        }
    },
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
    ],
    dropdownTree: [{
        key: 1,
        label: 'Europe',
        children: [{
            key: 2,
            label: 'France',
            parent: 1,
            children: [{
                key: 3,
                label: 'Paris',
                parent: 2
            }]
        }]
    }
    ],
    multiSelect: [
        {value: 1, label: 'Rome'},
        {value: 2, label: 'Cairo'},
        {value: 3, label: 'Athens'}
    ],
    select: [
        {value: 1, label: 'One'},
        {value: 2, label: 'Two'},
        {value: 3, label: 'Three'}
    ],
    multiSelectTreeTable: [{
        key: 1,
        data: {label: 'One'},
        children: [{
            key: 2,
            data: {label: 'Two'},
            children: [{
                key: 3,
                data: {label: 'Three'}
            }]
        }]
    }
    ],
    multiSelectTree: [{
        key: 1,
        label: 'Solar system',
        children: [{
            key: 2,
            label: 'Earth',
            children: [{
                key: 3,
                label: 'Australia'
            }]
        }]
    }
    ]
};
