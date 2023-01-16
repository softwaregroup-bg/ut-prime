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
                action: (props) => documentArchive(props),
                icon: 'p-c p-button-icon-left pi pi-inbox'
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

const documentArchive = ({current, selected, onChange}) => {
    let updatedValue = [];
    if (selected.length > 0) {
        updatedValue = current?.map(row => {
            if (selected?.some(item => item.id === row.id)) {
                if (row?.statusId && !['deleted', 'pending'].includes(row.statusId)) {
                    return {...row, statusId: 'archived'};
                } else {
                    return row;
                }
            } else {
                return row;
            }
        });
    } else {
        if (selected?.statusId && !['deleted', 'pending'].includes(selected.statusId)) {
            updatedValue = current?.map(row => {
                if (selected.id === row.id) {
                    return {...row, statusId: 'archived'};
                } else {
                    return row;
                }
            });
        }
    }
    onChange({...event, value: updatedValue});
};
