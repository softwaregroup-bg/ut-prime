import React from 'react';
import { InputText, Password, InputTextarea, Dropdown, MultiSelect, TreeSelect, TreeTable, InputMask, InputNumber, Calendar, Checkbox, Skeleton, Column } from '../prime';
import { RefCallBack } from 'react-hook-form';

import Table from './inputs/Table';
import MultiSelectPanel from './inputs/MultiSelectPanel';
import SelectButton from './inputs/SelectButton';

export default function input(
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
    if (loading) return <Skeleton className='p-inputtext'/>;
    const filterBy = item => (!filter && !optionsFilter) || Object.entries({...optionsFilter, ...filter}).every(([name, value]) => String(item[name]) === String(value));
    switch (type) {
        case 'dropdownTree': return <TreeSelect
            {...field}
            {...props}
        />;
        case 'text': return <InputTextarea
            {...field}
            {...props}
        />;
        case 'mask': return <InputMask
            {...field}
            {...props}
        />;
        case 'currency': return <InputNumber
            {...field}
            inputRef={field.ref}
            onChange={e => {
                field.onChange?.(e.value);
            }}
            minFractionDigits={2}
            maxFractionDigits={4}
            {...props}
        />;
        case 'boolean': return <Checkbox
            {...field}
            inputRef={field.ref}
            onChange={e => field.onChange?.(e.checked)}
            checked={field.value}
            {...props}
        />;
        case 'table': return <Table
            {...field}
            selectionMode='checkbox'
            filter={filter}
            properties={schema?.items?.properties}
            dropdowns={dropdowns}
            {...props}
        />;
        case 'dropdown': return <Dropdown
            {...field}
            options={dropdowns?.[dropdown]?.filter(filterBy) || []}
            disabled={parent && !filter}
            {...props}
        />;
        case 'multiSelect': return <MultiSelect
            {...field}
            options={dropdowns?.[dropdown]?.filter(filterBy) || []}
            disabled={parent && !filter}
            display='chip'
            {...props}
        />;
        case 'select': return <SelectButton
            {...field}
            options={dropdowns?.[dropdown]?.filter(filterBy) || []}
            disabled={parent && !filter}
            {...props}
        />;
        case 'multiSelectTree': return <TreeSelect
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
        />;
        case 'multiSelectPanel': return <MultiSelectPanel
            appendTo='self'
            {...field}
            options={dropdowns?.[dropdown]?.filter(filterBy) || []}
            disabled={parent && !filter}
            {...props}
        />;
        case 'selectTable': {
            const all = dropdowns?.[dropdown];
            const value = all.filter(filterBy) || [];
            const dataKey = props.dataKey || 'value';
            const valueKeys = value.map(item => item[dataKey]);
            const single = props.selectionMode === 'single';
            const hidden = !single && (field.value || []).filter(item => !valueKeys.includes(item));
            return <Table
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
            </Table>;
        }
        case 'multiSelectTreeTable': return <TreeTable
            {...field}
            value={dropdowns?.[dropdown]?.filter(filterBy) || []}
            selectionKeys={field.value}
            onSelectionChange={e => field.onChange?.(e.value)}
            selectionMode='checkbox'
            {...props}
        >
            <Column field='label' expander/>
        </TreeTable>;
        case 'date-time': return <Calendar
            {...field}
            showTime
            showIcon
            value={field.value != null ? new Date(field.value) : field.value}
            {...props}
        />;
        case 'time': return <Calendar
            {...field}
            timeOnly
            showIcon
            value={field.value != null ? new Date(field.value) : field.value}
            {...props}
        />;
        case 'date': return <Calendar
            {...field}
            showIcon
            value={field.value != null ? new Date(field.value) : field.value}
            {...props}
        />;
        case 'integer': return <InputNumber
            {...field}
            inputClassName='w-full'
            inputRef={field.ref}
            onChange={e => {
                field.onChange?.(e.value);
            }}
            showButtons
            {...props}
        />;
        case 'password': return <Password
            {...field}
            {...props}
        />;
        default: return <InputText
            {...field}
            {...props}
        />;
    }
}
