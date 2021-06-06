import React from 'react';
import clsx from 'clsx';
import Joi from 'joi';

import { Card, InputText, DataTable, Column, Dropdown, InputMask, InputNumber, Calendar } from '../prime';
import { Styled, StyledType } from './Editor.types';
import useForm from '../hooks/useForm';
import Controller from '../Controller';
import { joiResolver } from '@hookform/resolvers/joi';
import { RefCallBack } from 'react-hook-form';

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
function Table({onChange, columns, value, dataKey = 'id', ref}) {
    if (typeof ref === 'function') ref(React.useState({})[0]);
    const cellEditor = React.useCallback((props, field) => <InputText
        type="text"
        value={props.rowData[field]}
        onChange={({target: {value}}) => {
            const updatedValue = [...props.value];
            updatedValue[props.rowIndex][props.field] = value;
            onChange(updatedValue);
        }}
        id={`${props.rowData.id}`}
    />, [onChange]);
    const [original, setOriginal] = React.useState({index: null, value: null});

    const init = React.useCallback(({index}) => {
        setOriginal({index, value: {...value[index]}});
    }, [value, setOriginal]);

    const cancel = React.useCallback(() => {
        const restored = [...value];
        restored[original.index] = original.value;
        onChange(restored);
    }, [value, onChange]);

    return (
        <DataTable
            value={value}
            editMode="row"
            dataKey={dataKey}
            className="editable-cells-table"
            onRowEditInit={init}
            onRowEditCancel={cancel}
        >
            {
                (columns || []).map(({ field, header }) => <Column
                    key={field}
                    field={field}
                    header={header}
                    editor={props => cellEditor(props, field)}
                />)
            }
            <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        </DataTable>
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
    const schema = fields.reduce(
        (schema, {name, title, validation = Joi.string().allow('')}) => schema.append({[name]: validation.label(title)}),
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
