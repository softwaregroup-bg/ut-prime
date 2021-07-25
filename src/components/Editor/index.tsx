import React from 'react';
import clsx from 'clsx';
import Joi from 'joi';
import get from 'lodash.get';

import { Card, InputText, InputTextarea, Dropdown, TreeSelect, InputMask, InputNumber, Calendar, Checkbox } from '../prime';
import { Styled, StyledType, Properties } from './Editor.types';
import useForm from '../hooks/useForm';
import Controller from '../Controller';
import { joiResolver } from '@hookform/resolvers/joi';
import { RefCallBack } from 'react-hook-form';
import {Table} from './Table';

function Currency({onChange, ref, ...props}) {
    return (
        <InputNumber
            inputRef={ref}
            onChange={e => {
                onChange?.(e.value);
            }}
            maxFractionDigits={2}
            {...props}
        />
    );
}

function Bool({onChange, ref, value, ...props}) {
    return (
        <Checkbox
            inputRef={ref}
            onChange={e => {
                onChange?.(e.checked);
            }}
            checked={value}
            {...props}
        />
    );
}

function element(
    field: {
        onChange: (...event: any[]) => void;
        onBlur: () => void;
        value: any;
        name: string;
        ref: RefCallBack;
        className: string;
    }, {
        type = 'string',
        dropdown = '',
        ...props
    } = {},
    schema,
    dropdowns
) {
    const Element: React.ElementType = {
        dropdown: Dropdown,
        dropdownTree: TreeSelect,
        text: InputTextarea,
        mask: InputMask,
        date: Calendar,
        boolean: Bool,
        currency: Currency,
        table: Table
    }[type] || InputText;
    const element = {
        table: {
            properties: schema.items
        },
        dropdown: {
            ...dropdowns?.[dropdown] && {options: dropdowns?.[dropdown]}
        }
    }[type];
    return <Element {...field} {...element} {...props}/>;
}

const getSchema = (properties: Properties) : Joi.Schema => Object.entries(properties).reduce(
    (schema, [name, field]) => {
        if ('properties' in field) {
            return schema.append({[name]: getSchema(field.properties)});
        } else {
            const {title, validation = Joi.string().min(0).allow('', null)} = field;
            return schema.append({[name]: validation.label(title || name)});
        }
    },
    Joi.object()
);

const getIndex = (properties: Properties, root: string) : Properties => Object.entries(properties).reduce(
    (map, [name, property]) => {
        return ('properties' in property) ? {
            ...map,
            ...getIndex(property.properties, name + '.')
        } : {
            ...map,
            [root + name]: property
        };
    },
    {}
);

const Editor: StyledType = ({ classes, className, properties, cards, layout, onSubmit, trigger, value, dropdown, ...rest }) => {
    const joiSchema = getSchema(properties);
    const index = getIndex(properties, '');
    const {handleSubmit, control, reset, formState: {errors}} = useForm({resolver: joiResolver(joiSchema)});
    const getFormErrorMessage = (name) => {
        const error = get(errors, name);
        return error && <small className="p-error">{error.message}</small>;
    };
    React.useEffect(() => {
        if (trigger) trigger.current = handleSubmit(onSubmit);
    }, [trigger, handleSubmit, onSubmit]);
    React.useEffect(() => {
        reset(value || {});
    }, [value]);

    function card(id) {
        const {title, properties = []} = (cards[id] || {title: '❌ ' + id, className: 'p-lg-6 p-xl-4'});
        return (
            <Card title={title} key={id} className='p-fluid p-mb-3'>
                {properties.map(name => index[name]
                    ? <div className="p-field p-grid" key={name}>
                        {index[name].title ? <label className='p-col-12 p-md-4'>
                            {index[name].title}
                        </label> : null}
                        <div className={clsx(index[name].title ? 'p-col-12 p-md-8' : 'p-col-12')}>
                            <Controller
                                control={control}
                                name={name}
                                render={
                                    ({field}) => element({
                                        className: clsx({ 'p-invalid': errors[name] }),
                                        ...field
                                    }, index[name].editor, index[name], dropdown)
                                }
                            />
                        </div>
                        {getFormErrorMessage(name)}
                    </div>
                    : <div className="p-field p-grid" key={name}>❌ {name}</div>
                )}
            </Card>
        );
    }

    return (
        <form {...rest} onSubmit={handleSubmit(onSubmit)} className={clsx('p-grid p-col p-mt-2', className)}>
            {(layout || Object.keys(cards)).map((id, index) => {
                const nested = [].concat(id);
                const key = nested[0];
                return (
                    <div key={key} className={clsx('p-col-12', cards[key]?.className || 'p-xl-6')}>
                        {nested.map(card)}
                    </div>
                );
            })}
        </form>
    );
};

export default Styled(Editor);
