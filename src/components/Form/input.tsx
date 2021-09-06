import React from 'react';
import { InputText, InputTextarea, Dropdown, MultiSelect, TreeSelect, InputMask, InputNumber, Calendar, Checkbox, Skeleton } from '../prime';
import { RefCallBack } from 'react-hook-form';

import Table from './inputs/Table';
import MultiSelectPanel from './inputs/MultiSelectPanel';

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
        ...props
    } = {id: field?.name},
    schema,
    dropdowns,
    filter,
    loading: string
) {
    if (loading) return <Skeleton className='p-inputtext'/>;
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
            onChange={e => {
                field.onChange?.(e.checked);
            }}
            checked={field.value}
            {...props}
        />;
        case 'table': return <Table
            {...field}
            properties={schema?.items?.properties}
            dropdowns={dropdowns}
            {...props}
        />;
        case 'dropdown': return <Dropdown
            {...field}
            options={dropdowns?.[dropdown]?.filter(item => !filter || item.parent === filter) || []}
            disabled={parent && !filter}
            {...props}
        />;
        case 'multiSelect': return <MultiSelect
            {...field}
            options={dropdowns?.[dropdown]?.filter(item => !filter || item.parent === filter) || []}
            disabled={parent && !filter}
            display='chip'
            {...props}
        />;
        case 'multiSelectTree': return <TreeSelect
            {...field}
            options={dropdowns?.[dropdown]?.filter(item => !filter || item.parent === filter) || []}
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
            options={dropdowns?.[dropdown]?.filter(item => !filter || item.parent === filter) || []}
            disabled={parent && !filter}
            {...props}
        />;
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
            inputRef={field.ref}
            onChange={e => {
                field.onChange?.(e.value);
            }}
            showButtons
            {...props}
        />;
        default: return <InputText
            {...field}
            {...props}
        />;
    }
}
