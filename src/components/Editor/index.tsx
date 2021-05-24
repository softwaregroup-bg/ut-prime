import React from 'react';
import clsx from 'clsx';
import Joi from 'joi';

import { Card, InputText, Dropdown, InputMask, InputNumber, Calendar } from '../prime';
import { Styled, StyledType } from './Editor.types';
import useForm from '../hooks/useForm';
import Controller from '../Controller';
import { joiResolver } from '@hookform/resolvers/joi';

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

function element(field, {type = 'string', ...props} = {}) {
    const Element: React.ElementType = {
        dropdown: Dropdown,
        mask: InputMask,
        date: Calendar,
        currency: Currency
    }[type] || InputText;
    return <Element {...field} {...props}/>;
}

const Editor: StyledType = ({ classes, className, fields, cards, onSubmit, trigger, ...rest }) => {
    const schema = fields.reduce(
        (schema, {name, title, validation = Joi.string().allow('')}) => schema.append({[name]: validation.label(title)}),
        Joi.object()
    );
    const {handleSubmit, control, formState: {errors}} = useForm({resolver: joiResolver(schema)});
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };
    React.useEffect(() => {
        if (trigger) trigger.current = handleSubmit(onSubmit);
    }, [trigger, handleSubmit, onSubmit]);
    return (
        <div {...rest}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-grid p-m-2">
                {(cards || []).map(({id, title, className}) =>
                    <div key={id} className={clsx('p-col-12', className || 'p-xl-6')}>
                        <Card title={title} key={id} className='p-fluid'>
                            {fields.filter(({card}) => id === card).map(({name, title, editor}) =>
                                <div className="p-field p-grid" key={name}>
                                    <label className="p-col-12 p-md-4">
                                        {title}
                                    </label>
                                    <div className="p-col-12 p-md-8">
                                        <Controller
                                            control={control}
                                            name={name}
                                            render={({field}) => element({className: clsx({ 'p-invalid': errors[name] }), ...field}, editor)}
                                        />
                                    </div>
                                    {getFormErrorMessage(name)}
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Styled(Editor);
