import React from 'react';
import { InputText, Password, InputTextarea, Dropdown, MultiSelect, TreeSelect, TreeTable, InputMask, InputNumber, Calendar, Checkbox, Skeleton, Column } from '../prime';
import { RefCallBack } from 'react-hook-form';

import Table from './inputs/Table';
import MultiSelectPanel from './inputs/MultiSelectPanel';
import SelectButton from './inputs/SelectButton';

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
        type = 'string',
        dropdown = '',
        parent = '',
        optionsFilter = null,
        title = '',
        ...props
    }: any = {id: field?.name},
    schema,
    dropdowns,
    filter,
    loading: string
) {
    if (loading) return <>{label}<div className={inputClass}><Skeleton className='p-inputtext'/></div></>;
    props.disabled = schema.readOnly;
    const Field = ({children}) => <>
        {label}
        <div className={inputClass}>{children}</div>
        {error}
    </>;
    const filterBy = item => (!filter && !optionsFilter) || Object.entries({...optionsFilter, ...filter}).every(([name, value]) => String(item[name]) === String(value));
    switch (type) {
        case 'dropdownTree': return <Field>
            <TreeSelect
                {...field}
                {...props}
            />
        </Field>;
        case 'text': return <Field>
            <InputTextarea
                {...field}
                {...props}
            />
        </Field>;
        case 'mask': return <Field>
            <InputMask
                {...field}
                {...props}
            />
        </Field>;
        case 'currency': return <Field>
            <InputNumber
                {...field}
                inputRef={field.ref}
                onChange={e => {
                    field.onChange?.(e.value);
                }}
                minFractionDigits={2}
                maxFractionDigits={4}
                {...props}
            />
        </Field>;
        case 'boolean': return <Field>
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
                    filter={filter}
                    properties={schema?.items?.properties}
                    dropdowns={dropdowns}
                    {...props}
                />
            </div>
        </>;
        case 'dropdown': return <Field>
            <Dropdown
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                disabled={parent && !filter}
                {...props}
            />
        </Field>;
        case 'multiSelect': return <Field>
            <MultiSelect
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                disabled={parent && !filter}
                display='chip'
                {...props}
            />
        </Field>;
        case 'select': return <Field>
            <SelectButton
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                disabled={parent && !filter}
                {...props}
            />
        </Field>;
        case 'multiSelectTree': return <Field>
            <TreeSelect
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                disabled={parent && !filter}
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
        case 'multiSelectPanel': return <Field>
            <MultiSelectPanel
                appendTo='self'
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                disabled={parent && !filter}
                {...props}
            />
        </Field>;
        case 'selectTable': {
            const all = dropdowns?.[dropdown];
            const value = all.filter(filterBy) || [];
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
        case 'date-time': return <Field>
            <Calendar
                {...field}
                showTime
                showIcon
                value={field.value != null ? new Date(field.value) : field.value}
                {...props}
            />
        </Field>;
        case 'time': return <Field>
            <Calendar
                {...field}
                timeOnly
                showIcon
                value={field.value != null ? new Date(field.value) : field.value}
                {...props}
            />
        </Field>;
        case 'date': return <Field>
            <Calendar
                {...field}
                showIcon
                value={field.value != null ? new Date(field.value) : field.value}
                {...props}
            />
        </Field>;
        case 'integer': return <Field>
            <InputNumber
                {...field}
                inputClassName='w-full'
                inputRef={field.ref}
                onChange={e => {
                    field.onChange?.(e.value);
                }}
                showButtons
                {...props}
            />
        </Field>;
        case 'password': return <Field>
            <Password
                {...field}
                {...props}
            />
        </Field>;
        default: return <Field>
            <InputText
                {...field}
                {...props}
            />
        </Field>;
    }
}
