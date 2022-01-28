import type {
    Schema,
    Cards
} from '../types';

export const input: {
    schema: Schema,
    cards: Cards
} = {
    schema: {
        properties: {
            input: {
                required: ['treeName'],
                properties: {
                    input: {
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
                    currency: {
                        widget: {
                            type: 'currency',
                            currency: 'USD'
                        }
                    },
                    boolean: {
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
                    multiSelectTreeTable: {
                        widget: {
                            type: 'multiSelectTreeTable',
                            dropdown: 'select'
                        }
                    },
                    date: {
                        widget: {
                            type: 'date',
                            showOnFocus: false
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
                    image: {
                        widget: {
                            type: 'image'
                        }
                    },
                    password: {
                        widget: {
                            type: 'password'
                        }
                    }
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
        left: {
            className: 'xl:col-4',
            widgets: [
                'input.input',
                'input.password',
                'input.text',
                'input.mask',
                'input.boolean',
                'input.date',
                'input.time',
                'input.datetime',
                'input.number',
                'input.currency',
                'input.integer'
            ]
        },
        center: {
            className: 'xl:col-4',
            widgets: [
                'input.image',
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
                'input.multiSelectTreeTable'
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
    dropdownTree: [
        {key: 1, label: 'Asia'},
        {key: 2, label: 'Europe'},
        {key: 3, label: 'Australia'}
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
    multiSelectTree: [
        {key: 1, label: 'Earth'},
        {key: 2, label: 'Mars'},
        {key: 3, label: 'Australia'}
    ]
};
