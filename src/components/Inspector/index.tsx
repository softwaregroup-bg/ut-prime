import React from 'react';
import clsx from 'clsx';
import {createUseStyles} from 'react-jss';
import lodashSet from 'lodash.set';
import lodashGet from 'lodash.get';
import type {ComponentProps} from './Inspector.types';

import type {Props as EditorProps} from '../Editor/Editor.types';

const useStyles = createUseStyles({
    inspector: {
        '& .p-card-body': {
            padding: '0.25rem',
            '& .p-card-content': {
                paddingTop: 0,
                '& .field': {
                    marginBottom: '0.25rem'
                }
            }
        }
    }
});

const props : Record<string, EditorProps> = {
    schema: {
        schema: {
            type: 'object',
            properties: {
                title: {type: 'string', widget: {showClear: true}},
                body: {type: 'string', widget: {showClear: true}},
                filter: {type: 'boolean', widget: {showClear: true}},
                sort: {type: 'boolean', widget: {showClear: true}},
                type: {
                    type: 'string',
                    widget: {type: 'dropdown', dropdown: 'type', showClear: true}
                },
                widget: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            title: 'Widget',
                            widget: {type: 'dropdown', dropdown: 'widget', showClear: true}
                        },
                        parent: {type: 'string', widget: {showClear: true}}
                    }
                }
            }
        },
        cards: {
            edit: {
                label: 'Field',
                className: 'w-full p-0',
                classes: {
                    default: {
                        field: 'field grid'
                    }
                },
                widgets: ['title', 'body', 'filter', 'sort', 'type', 'widget.type', 'widget.parent']
            }
        },
        onDropdown: () => Promise.resolve({
            type: [
                {value: 'string', label: 'String'},
                {value: 'number', label: 'Number'},
                {value: 'boolean', label: 'Boolean'},
                {value: 'object', label: 'Object'},
                {value: 'array', label: 'Array'}
            ],
            widget: [
                {value: 'autocomplete', label: 'autocomplete'},
                {value: 'boolean', label: 'boolean'},
                {value: 'button', label: 'button'},
                {value: 'currency', label: 'currency'},
                {value: 'date-time', label: 'date-time'},
                {value: 'date', label: 'date'},
                {value: 'dropdown', label: 'dropdown'},
                {value: 'dropdownTree', label: 'dropdownTree'},
                {value: 'file', label: 'file'},
                {value: 'icon', label: 'icon'},
                {value: 'image', label: 'image'},
                {value: 'integer', label: 'integer'},
                {value: 'label', label: 'label'},
                {value: 'mask', label: 'mask'},
                {value: 'multiSelect', label: 'multiSelect'},
                {value: 'multiSelectPanel', label: 'multiSelectPanel'},
                {value: 'multiSelectTree', label: 'multiSelectTree'},
                {value: 'multiSelectTreeTable', label: 'multiSelectTreeTable'},
                {value: 'number', label: 'number'},
                {value: 'password', label: 'password'},
                {value: 'radio', label: 'radio'},
                {value: 'select-table-radio', label: 'select-table-radio'},
                {value: 'select', label: 'select'},
                {value: 'selectTable', label: 'selectTable'},
                {value: 'string', label: 'string'},
                {value: 'table', label: 'table'},
                {value: 'text', label: 'text'},
                {value: 'time', label: 'time'}
            ]
        })
    },
    card: {
        schema: {
            type: 'object',
            properties: {
                label: {type: 'string', widget: {showClear: true}},
                watch: {type: 'string', widget: {showClear: true}},
                match: {type: 'string', widget: {showClear: true}},
                className: {type: 'string', title: 'Class', widget: {showClear: true}},
                type: {
                    type: 'string',
                    widget: {
                        type: 'select',
                        options: [
                            {value: 'card', label: 'Card'},
                            {value: 'toolbar', label: 'Toolbar'}
                        ]
                    }
                },
                hidden: {type: 'boolean', widget: {showClear: true}},
                classes: {
                    type: 'object',
                    properties: {
                        card: {type: 'string', title: 'Card class', widget: {showClear: true}},
                        default: {
                            type: 'object',
                            properties: {
                                field: {type: 'string', title: 'Field class', widget: {showClear: true}},
                                label: {type: 'string', title: 'Label class', widget: {showClear: true}}
                            }
                        }
                    }
                }
            }
        },
        cards: {
            edit: {
                label: 'Card',
                className: 'w-full p-0',
                classes: {
                    default: {
                        field: 'field grid'
                    }
                },
                widgets: ['label', 'watch', 'match', 'className', 'classes.card', 'classes.default.field', 'classes.default.label']
            }
        },
        onDropdown: () => Promise.resolve({})
    }
};

const Inspector: ComponentProps = ({
    Editor,
    className,
    object = {},
    type = 'schema',
    property,
    onChange
}) => {
    const classes = useStyles();
    const handleChange = React.useCallback(({$original, ...value}) => {
        onChange((prev = {}) => ({
            ...prev,
            [type]: {...lodashSet(prev[type], property, value)}
        }));
    }, [property, type, onChange]);
    const init = React.useMemo(() => {
        return property ? lodashGet(object, property) : object;
    }, [object, property]);
    return <div className={clsx(className, classes.inspector)}>
        <Editor
            init={init}
            key={String(property)}
            onChange={handleChange}
            {...props[type]}
        />
    </div>;
};

export default Inspector;
