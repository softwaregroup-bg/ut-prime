import React from 'react';
import { Checkbox, Dropdown, Calendar, InputMask, InputText, InputTextarea } from '../prime';

export interface TableFilter {
    filters?: {
        [name: string]: {
            value: any;
            matchMode: any;
        }
    },
    sortField?: string,
    sortOrder?: -1 | 1,
    first: number,
    page: number
}

function dateOrNull(value) {
    if (value == null) return null;
    return new Date(value);
}

export default function columnProps({
    name,
    property,
    dropdowns,
    tableFilter,
    filterBy,
    editable
}: {
    name: string,
    property: {
        widget?: any,
        readOnly?: boolean,
        body?: string
    },
    dropdowns: {},
    tableFilter?: TableFilter,
    filterBy?: (name: string, value: string) => (e: {}) => void,
    editable?: boolean
}) {
    const {type, dropdown, parent, column, ...props} = property?.widget || {name};
    const fieldName = name;
    let filterElement, body, editor;
    switch (type) {
        case 'boolean':
            filterElement = filterBy && <Checkbox
                checked={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'checked')}
                {...props}
            />;
            body = function body(rowData) {
                const value = rowData[property?.body || fieldName];
                if (value == null) return null;
                return <i className={`pi ${value ? 'pi-check' : 'pi-times'}`}></i>;
            };
            break;
        case 'dropdown':
            filterElement = filterBy && <Dropdown
                className='w-full'
                options={dropdowns?.[dropdown] || []}
                value={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'value')}
                showClear
                {...props}
            />;
            body = function body(rowData) {
                return rowData[property?.body || fieldName];
            };
            break;
        case 'date':
            body = function body(rowData) {
                return dateOrNull(rowData[fieldName])?.toLocaleDateString();
            };
            break;
        case 'time':
            body = function body(rowData) {
                return dateOrNull(rowData[fieldName])?.toLocaleTimeString();
            };
            break;
        case 'date-time':
            body = function body(rowData) {
                const value = rowData[fieldName];
                if (value == null) return null;
                return new Date(value).toLocaleString();
            };
            break;
    }
    if (!property?.readOnly && editable) {
        editor = function editor(p) {
            const widget = p.rowData?.$pivot?.[fieldName]?.widget || p.rowData?.$pivot?.widget;
            switch (widget?.type || type) {
                case 'boolean':
                    return <Checkbox
                        checked={p.rowData[fieldName]}
                        onChange={event => p.editorCallback(event.checked)}
                        {...props}
                    />;
                case 'dropdown':
                    return <Dropdown
                        className='w-full'
                        options={dropdowns?.[dropdown] || []}
                        value={p.rowData[fieldName]}
                        onChange={event => p.editorCallback(event.value)}
                        showClear
                        {...props}
                    />;
                case 'date':
                    return <Calendar
                        showOnFocus={false}
                        className='w-full'
                        value={dateOrNull(p.rowData[fieldName])}
                        onChange={event => p.editorCallback(event.value)}
                        showIcon
                        {...props}
                    />;
                case 'time':
                    return <Calendar
                        showOnFocus={false}
                        className='w-full'
                        value={dateOrNull(p.rowData[fieldName])}
                        onChange={event => p.editorCallback(event.value)}
                        timeOnly
                        showIcon
                        {...props}
                    />;
                case 'date-time':
                    return <Calendar
                        showOnFocus={false}
                        className='w-full'
                        value={dateOrNull(p.rowData[fieldName])}
                        onChange={event => p.editorCallback(event.value)}
                        showTime
                        showIcon
                        {...props}
                    />;
                case 'mask':
                    return <InputMask
                        className='w-full'
                        value={p.rowData[fieldName]}
                        onChange={event => p.editorCallback(event.value)}
                        {...props}
                    />;
                case 'text':
                    return <InputTextarea
                        className='w-full'
                        autoFocus={true}
                        value={p.rowData[fieldName]}
                        onChange={event => p.editorCallback(event.target.value)}
                        {...props}
                    />;
                default:
                    return <InputText
                        type='text'
                        autoFocus={true}
                        value={p.rowData[fieldName]}
                        onChange={event => p.editorCallback(event.target.value)}
                        disabled={property?.readOnly}
                        className='w-full'
                        id={`${p.rowData.id}`}
                        {...props}
                    />;
            };
        };
    }
    return {
        showClearButton: true,
        showFilterMenu: false,
        ...filterElement && {filterElement},
        ...body && {body},
        ...(editor != null) && {editor},
        ...column
    };
}
