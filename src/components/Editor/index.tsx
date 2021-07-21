import React from 'react';
import clsx from 'clsx';
import Joi from 'joi';

import { Card, InputText, InputTextarea, Dropdown, TreeSelect, InputMask, InputNumber, Calendar } from '../prime';
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
        dropdownTree: TreeSelect,
        text: InputTextarea,
        mask: InputMask,
        date: Calendar,
        currency: Currency,
        table: Table
    }[type] || InputText;
    return <Element {...field} {...props}/>;
}

const Editor: StyledType = ({ classes, className, fields, cards, layout, onSubmit, trigger, value, ...rest }) => {
    const schema = Object.entries(fields).reduce(
        (schema, [name, {title, validation = Joi.string().min(0).allow('', null)}]) => schema.append({[name]: validation.label(title || name)}),
        Joi.object()
    );
    const {handleSubmit, control, reset, formState: {errors}} = useForm({resolver: joiResolver(schema)});
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };
    React.useEffect(() => {
        if (trigger) trigger.current = handleSubmit(onSubmit);
    }, [trigger, handleSubmit, onSubmit]);
    React.useEffect(() => {
        reset(value || {});
    }, [value]);

    function card(id) {
        const {title, fields: names = []} = (cards[id] || {title: '❌ ' + id, className: 'p-lg-6 p-xl-4'});
        return (
            <Card title={title} key={id} className='p-fluid p-mb-3'>
                {names.map(name => fields[name]
                    ? <div className="p-field p-grid" key={name}>
                        {fields[name].title ? <label className='p-col-12 p-md-4'>
                            {fields[name].title}
                        </label> : null}
                        <div className={clsx(fields[name].title ? 'p-col-12 p-md-8' : 'p-col-12')}>
                            <Controller
                                control={control}
                                name={name}
                                render={
                                    ({field}) => element({
                                        className: clsx({ 'p-invalid': errors[name] }),
                                        ...field
                                    }, fields[name].editor)
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
