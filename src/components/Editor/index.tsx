import React from 'react';
import clsx from 'clsx';
import Joi from 'joi';

import { Card, InputText, Dropdown, InputMask, InputNumber, Calendar } from '../prime';
import { Styled, StyledType } from './Editor.types';
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

function element(field: { onChange: (...event: any[]) => void; onBlur: () => void; value: any; name: string; ref: RefCallBack; className: string; }, {type = 'string', ...props} = {}) {
    const Element: React.ElementType = {
        dropdown: Dropdown,
        mask: InputMask,
        date: Calendar,
        currency: Currency,
        table: Table
    }[type] || InputText;
    return <Element {...field} {...props}/>;
}

const Editor: StyledType = ({ classes, className, fields, cards, onSubmit, trigger, get, ...rest }) => {
    const schema = Object.entries(fields).reduce(
        (schema, [name, {title, validation = Joi.string().min(0).allow('', null).default('label')}]) => schema.append({[name]: validation.label(title || name)}),
        Joi.object()
    );
    const {handleSubmit, reset, control, formState: {errors}} = useForm({resolver: joiResolver(schema)});
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };
    React.useEffect(() => {
        if (trigger) trigger.current = handleSubmit(onSubmit);
    }, [trigger, handleSubmit, onSubmit]);
    React.useEffect(() => {
        (async() => reset(get ? await get() : {}))();
    }, [get]);
    return (
        <div {...rest}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-grid p-m-2">
                {Object.entries(cards || {}).map(([id, {title, className, fields: names = []}]) =>
                    <div key={id} className={clsx('p-col-12', className || 'p-xl-6')}>
                        <Card title={title} key={id} className='p-fluid'>
                            {names.map(name =>
                                <div className="p-field p-grid" key={name}>
                                    {fields[name].title ? <label className={clsx(fields[name].title ? `p-col-12 ${className || 'p-md-4'}` : '')}>
                                        {fields[name].title}
                                    </label> : null}
                                    <div className={clsx(fields[name].title ? `p-col-12 ${className || 'p-md-8'}` : 'p-col-12')}>
                                        <Controller
                                            control={control}
                                            name={name}
                                            render={({field}) => element({className: clsx({ 'p-invalid': errors[name] }), ...field}, fields[name].editor)}
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
