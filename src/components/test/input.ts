import type {
    Schema,
    Cards,
    Properties
} from '../types';

const properties: Properties = {
    input: {
        filter: true
    },
    dropdownTree: {
        widget: {
            type: 'dropdownTree',
            dropdown: 'dropdownTree'
        }
    },
    text: {
        widget: {
            type: 'text'
        }
    },
    mask: {
        widget: {
            type: 'mask',
            mask: '***.***.***.***'
        }
    },
    chips: {
        widget: {
            type: 'chips'
        }
    },
    autocomplete: {
        widget: {
            type: 'autocomplete',
            autocomplete: 'handleAutocomplete',
            columns: [{
                name: 'label',
                className: 'col-8'
            }, {
                name: 'status',
                className: 'col-4 text-green-500'
            }],
            panelStyle: {width: 400},
            minLength: 2,
            maxLength: 34,
            delay: 300
        }
    },
    currency: {
        widget: {
            type: 'currency',
            currency: 'USD'
        }
    },
    boolean: {
        filter: true,
        widget: {
            type: 'boolean'
        }
    },
    table: {
        items: {
            properties: {
                name: {},
                value: {}
            }
        },
        widget: {
            type: 'table',
            widgets: ['name', 'value']
        }
    },
    dropdown: {
        filter: true,
        widget: {
            type: 'dropdown',
            dropdown: 'dropdown'
        }
    },
    multiSelect: {
        widget: {
            type: 'multiSelect',
            dropdown: 'multiSelect'
        }
    },
    select: {
        widget: {
            type: 'select',
            dropdown: 'select'
        }
    },
    multiSelectTree: {
        widget: {
            type: 'multiSelectTree',
            dropdown: 'multiSelectTree'
        }
    },
    multiSelectPanel: {
        widget: {
            type: 'multiSelectPanel',
            dropdown: 'select'
        }
    },
    selectTable: {
        widget: {
            type: 'selectTable',
            dropdown: 'select'
        }
    },
    selectTableWithFlags: {
        items: {
            properties: {
                flag1: {widget: {type: 'select-table-radio'}},
                flag2: {widget: {type: 'select-table-radio'}}
            }
        },
        widget: {
            type: 'selectTable',
            dropdown: 'select',
            widgets: ['flag1', 'flag2'],
            selectionMode: 'checkbox'
        }
    },
    multiSelectTreeTable: {
        widget: {
            type: 'multiSelectTreeTable',
            dropdown: 'multiSelectTreeTable'
        }
    },
    date: {
        widget: {
            type: 'date',
            showOnFocus: false
        }
    },
    daterange: {
        widget: {
            type: 'dateRange'
        }
    },
    time: {
        widget: {
            type: 'time',
            showOnFocus: false
        }
    },
    datetime: {
        widget: {
            type: 'date-time',
            showOnFocus: false
        }
    },
    number: {
        widget: {
            type: 'number'
        }
    },
    integer: {
        widget: {
            type: 'integer'
        }
    },
    gps: {
        widget: {
            type: 'gps'
        }
    },
    image: {
        widget: {
            type: 'image'
        }
    },
    imageUpload: {
        widget: {
            type: 'imageUpload'
        }
    },
    file: {
        widget: {
            type: 'file'
        }
    },
    ocr: {
        widget: {
            type: 'ocr'
        }
    },
    password: {
        widget: {
            type: 'password'
        }
    },
    radio: {
        widget: {
            type: 'radio'
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
            },
            table: {
                type: 'array',
                widget: {
                    type: 'table'
                },
                title: '',
                items: {
                    properties
                }
            }
        }
    },
    cards: {
        edit: {
            label: 'Input',
            widgets: [
                'input.input',
                'input.text',
                'input.dropdownTree',
                'input.mask',
                'input.currency',
                'input.boolean',
                'input.table',
                'input.dropdown',
                'input.multiSelect',
                'input.select',
                'input.multiSelectTree',
                'input.multiSelectPanel',
                'input.selectTable',
                'input.multiSelectTreeTable',
                'input.date',
                'input.time',
                'input.datetime',
                'input.number',
                'input.integer',
                'input.image',
                'input.password'
            ]
        },
        table: {
            className: 'xl:col-12',
            widgets: [{
                name: 'table',
                id: 'table1',
                widgets: [
                    'input',
                    'password',
                    'text',
                    'mask',
                    'boolean',
                    'date',
                    'time',
                    'datetime'
                ]
            }, {
                name: 'table',
                id: 'table2',
                widgets: [
                    'number',
                    'currency',
                    'integer',
                    'image',
                    'radio',
                    'select',
                    'table'
                ]
            }, {
                name: 'table',
                id: 'table3',
                widgets: [
                    'dropdown',
                    'dropdownTree',
                    'multiSelect',
                    'multiSelectTree'
                ]
            }, {
                name: 'table',
                id: 'table4',
                widgets: [
                    'input.selectTable',
                    'input.multiSelectPanel',
                    'input.multiSelectTreeTable'
                ]
            }]
        },
        left: {
            className: 'xl:col-4',
            widgets: [
                'input.input',
                'input.password',
                'input.text',
                'input.mask',
                'input.chips',
                'input.autocomplete',
                'input.boolean',
                'input.date',
                'input.time',
                'input.datetime',
                'input.daterange',
                'input.number',
                'input.currency',
                'input.integer'
            ]
        },
        center: {
            className: 'xl:col-4',
            widgets: [
                'input.gps',
                'input.image',
                'input.imageUpload',
                'input.file',
                'input.ocr',
                'input.dropdown',
                'input.dropdownTree',
                'input.multiSelect',
                'input.multiSelectTree',
                'input.select',
                'input.table'
            ]
        },
        right: {
            className: 'xl:col-4',
            widgets: [
                'input.selectTable',
                'input.multiSelectPanel',
                'input.multiSelectTreeTable',
                'input.selectTableWithFlags'
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
