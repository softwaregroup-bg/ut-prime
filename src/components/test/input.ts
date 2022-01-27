import type {
    Schema,
    Cards
} from '../types';

const input: {
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
                            dropdown: 'input.dropdown'
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
                            dropdown: 'input.dropdown'
                        }
                    },
                    multiSelect: {
                        widget: {
                            type: 'multiSelect',
                            dropdown: 'input.dropdown'
                        }
                    },
                    select: {
                        widget: {
                            type: 'select',
                            dropdown: 'input.dropdown'
                        }
                    },
                    multiSelectTree: {
                        widget: {
                            type: 'multiSelectTree',
                            dropdown: 'input.dropdownTree'
                        }
                    },
                    multiSelectPanel: {
                        widget: {
                            type: 'multiSelectPanel',
                            dropdown: 'input.dropdown'
                        }
                    },
                    selectTable: {
                        widget: {
                            type: 'selectTable',
                            dropdown: 'input.dropdown'
                        }
                    },
                    multiSelectTreeTable: {
                        widget: {
                            type: 'multiSelectTreeTable',
                            dropdown: 'input.dropdownTree'
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

export default input;
