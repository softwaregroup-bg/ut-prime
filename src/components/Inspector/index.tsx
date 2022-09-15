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
                title: {type: 'string', widget: {clear: 'pi-replay'}},
                body: {type: 'string', widget: {clear: 'pi-replay'}},
                filter: {type: 'boolean', widget: {clear: 'pi-replay'}},
                sort: {type: 'boolean', widget: {clear: 'pi-replay'}},
                type: {
                    type: 'string',
                    widget: {type: 'dropdown', dropdown: 'type', showClear: 'pi-replay'}
                },
                widget: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            title: 'Widget',
                            widget: {type: 'dropdown', dropdown: 'widget', showClear: 'pi-replay'}
                        },
                        labelClass: {
                            type: 'string',
                            title: 'Label Class',
                            default: 'md:col-4',
                            widget: {clear: 'pi-replay', type: 'chips', className: 'h-10rem'}
                        },
                        className: {
                            type: 'string',
                            title: 'Input Class',
                            default: 'w-full',
                            widget: {clear: 'pi-replay', type: 'chips', className: 'h-10rem'}
                        },
                        fieldClass: {
                            type: 'string',
                            title: 'Field Class',
                            default: 'md:col-8',
                            widget: {clear: 'pi-replay', type: 'chips', className: 'h-10rem'}
                        },
                        parent: {
                            type: 'string',
                            widget: {clear: 'pi-replay'}
                        }
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
                        label: 'md:col-3',
                        field: 'md:col-9'
                    }
                },
                widgets: [
                    'title',
                    'body',
                    'filter',
                    'sort',
                    'type',
                    'widget.type',
                    'widget.parent',
                    'widget.labelClass',
                    'widget.fieldClass',
                    'widget.className'
                ]
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
                label: {type: 'string', widget: {clear: 'pi-replay'}},
                watch: {type: 'string', widget: {clear: 'pi-replay'}},
                match: {type: 'string', widget: {clear: 'pi-replay'}},
                className: {
                    type: 'string',
                    title: 'Class',
                    default: 'xl:col-6',
                    widget: {clear: 'pi-replay', type: 'chips', className: 'h-6rem'}
                },
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
                hidden: {type: 'boolean', widget: {clear: 'pi-replay'}},
                classes: {
                    type: 'object',
                    properties: {
                        card: {
                            type: 'string',
                            title: 'Card class',
                            widget: {clear: 'pi-replay', type: 'chips', className: 'h-8rem'}
                        },
                        default: {
                            type: 'object',
                            properties: {
                                widget: {
                                    type: 'string',
                                    title: 'Widget class',
                                    default: 'field grid',
                                    widget: {clear: 'pi-replay', type: 'chips', className: 'h-8rem'}
                                },
                                label: {
                                    type: 'string',
                                    title: 'Label class',
                                    default: 'md:col-4',
                                    widget: {clear: 'pi-replay', type: 'chips', className: 'h-8rem'}
                                },
                                field: {
                                    type: 'string',
                                    title: 'Field class',
                                    default: 'md:col-8',
                                    widget: {clear: 'pi-replay', type: 'chips', className: 'h-8rem'}
                                },
                                input: {
                                    type: 'string',
                                    title: 'Input class',
                                    default: 'w-full',
                                    widget: {clear: 'pi-replay', type: 'chips', className: 'h-8rem'}
                                }
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
                        label: 'md:col-3',
                        field: 'md:col-9'
                    }
                },
                widgets: [
                    'label',
                    'watch',
                    'match',
                    'className',
                    'classes.card',
                    'classes.default.widget',
                    'classes.default.label',
                    'classes.default.field',
                    'classes.default.input'
                ]
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
            noScroll
            key={String(property)}
            onChange={handleChange}
            {...props[type]}
        />
    </div>;
};

export default Inspector;
