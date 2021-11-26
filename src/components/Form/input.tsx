import React from 'react';
import {
    InputText,
    Password,
    InputTextarea,
    Dropdown,
    MultiSelect,
    TreeSelect,
    TreeTable,
    InputMask,
    InputNumber,
    Calendar,
    Checkbox,
    Image,
    Skeleton,
    Column
} from '../prime';
import { RefCallBack } from 'react-hook-form';

import Table from './inputs/Table';
import MultiSelectPanel from './inputs/MultiSelectPanel';
import SelectButton from './inputs/SelectButton';

const Field = ({children, label, error, inputClass}) => <>
    {label}
    <div className={inputClass}>{children}</div>
    {error}
</>;

export default function input(
    label,
    error,
    field: {
        onChange: (...event: any[]) => void;
        onBlur: () => void;
        value: any;
        name: string;
        ref: RefCallBack;
        className: string;
    },
    inputClass,
    {
        type,
        dropdown = '',
        parent: parentField = '',
        optionsFilter = null,
        title = '',
        ...props
    }: any = {id: field?.name},
    schema,
    dropdowns,
    parentValue,
    loading: string
) {
    if (loading) return <>{label}<div className={inputClass}><Skeleton className='p-inputtext'/></div></>;
    props.disabled = schema.readOnly;
    const filterBy = item => (!parentField && !optionsFilter) || Object.entries({...optionsFilter, parent: parentValue}).every(([name, value]) => String(item[name]) === String(value));
    switch (type || schema.type) {
        case 'dropdownTree': return <Field {...{label, error, inputClass}}>
            <TreeSelect
                {...field}
                {...props}
            />
        </Field>;
        case 'text': return <Field {...{label, error, inputClass}}>
            <InputTextarea
                {...field}
                value={field.value || ''}
                {...props}
            />
        </Field>;
        case 'mask': return <Field {...{label, error, inputClass}}>
            <InputMask
                {...field}
                value={field.value || ''}
                {...props}
            />
        </Field>;
        case 'currency': return <Field {...{label, error, inputClass}}>
            <InputNumber
                {...field}
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.value)}
                minFractionDigits={2}
                maxFractionDigits={4}
                {...props}
            />
        </Field>;
        case 'boolean': return <Field {...{label, error, inputClass}}>
            <Checkbox
                {...field}
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.checked)}
                checked={field.value}
                {...props}
            />
        </Field>;
        case 'table': return <>
            {error}
            {label}
            <div className={inputClass}>
                <Table
                    {...field}
                    selectionMode='checkbox'
                    parent={parentValue}
                    properties={schema?.items?.properties}
                    dropdowns={dropdowns}
                    {...props}
                />
            </div>
        </>;
        case 'dropdown': return <Field {...{label, error, inputClass}}>
            <Dropdown
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                disabled={parentField && !parentValue}
                {...props}
            />
        </Field>;
        case 'multiSelect': return <Field {...{label, error, inputClass}}>
            <MultiSelect
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                disabled={parentField && !parentValue}
                display='chip'
                {...props}
            />
        </Field>;
        case 'select': return <Field {...{label, error, inputClass}}>
            <SelectButton
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                disabled={parentField && !parentValue}
                {...props}
            />
        </Field>;
        case 'multiSelectTree': return <Field {...{label, error, inputClass}}>
            <TreeSelect
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                disabled={parentField && !parentValue}
                display='chip'
                selectionMode='multiple'
                metaKeySelection={false}
                onChange={e => {
                    field.onChange?.(Object.keys(e.value));
                }}
                value={field.value?.map && Object.fromEntries(field.value?.map(value => [value, true]))}
                {...props}
            />
        </Field>;
        case 'multiSelectPanel': return <Field {...{label, error, inputClass}}>
            <MultiSelectPanel
                appendTo='self'
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                disabled={parentField && !parentValue}
                {...props}
            />
        </Field>;
        case 'selectTable': {
            const all = dropdowns?.[dropdown];
            const value = all?.filter(filterBy) || [];
            const dataKey = props.dataKey || 'value';
            const valueKeys = value.map(item => item[dataKey]);
            const single = props.selectionMode === 'single';
            const hidden = !single && (field.value || []).filter(item => !valueKeys.includes(item));
            return <>
                {error}
                {label}
                <div className={inputClass}>
                    <Table
                        {...field}
                        actions={{allowAdd: false, allowEdit: false, allowDelete: false}}
                        dataKey={dataKey}
                        value={value}
                        selection={single ? value.find(row => row?.[dataKey] === field.value) : value.filter(row => field.value?.includes(row?.[dataKey]))}
                        onSelectionChange={event =>
                            field.onChange?.(
                                single
                                    ? event.value[dataKey]
                                    : [].concat(hidden, event.value?.map(row => row?.[dataKey])),
                                {children: false, ...props.change}
                            )
                        }
                        {...props}
                    >
                        <Column field='label' header={title}/>
                    </Table>
                </div>
            </>;
        }
        case 'multiSelectTreeTable': return <>
            {error}
            {label}
            <div className={inputClass}>
                <TreeTable
                    {...field}
                    value={dropdowns?.[dropdown]?.filter(filterBy) || []}
                    selectionKeys={field.value}
                    onSelectionChange={e => field.onChange?.(e.value)}
                    selectionMode='checkbox'
                    {...props}
                >
                    <Column field='label' expander/>
                </TreeTable>
            </div>
        </>;
        case 'date-time': return <Field {...{label, error, inputClass}}>
            <Calendar
                {...field}
                showTime
                showIcon
                value={field.value != null ? new Date(field.value) : field.value}
                {...props}
            />
        </Field>;
        case 'time': return <Field {...{label, error, inputClass}}>
            <Calendar
                {...field}
                timeOnly
                showIcon
                value={field.value != null ? new Date(field.value) : field.value}
                {...props}
            />
        </Field>;
        case 'date': return <Field {...{label, error, inputClass}}>
            <Calendar
                {...field}
                showIcon
                value={field.value != null ? new Date(field.value) : field.value}
                {...props}
            />
        </Field>;
        case 'number': return <Field {...{label, error, inputClass}}>
            <InputNumber
                {...field}
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.value)}
                {...props}
            />
        </Field>;
        case 'integer': return <Field {...{label, error, inputClass}}>
            <InputNumber
                {...field}
                inputClassName='w-full'
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.value)}
                showButtons
                {...props}
            />
        </Field>;
        case 'image': return <Field {...{label, error, inputClass}}>
            <Image
                imageClassName='w-full'
                preview
                src={field.value}
                {...props}
            />
        </Field>;
        case 'password': return <Field {...{label, error, inputClass}}>
            <Password
                {...field}
                value={field.value || ''}
                {...props}
            />
        </Field>;
        default: return <Field {...{label, error, inputClass}}>
            <InputText
                {...field}
                value={field.value || ''}
                {...props}
            />
        </Field>;
    }
}
