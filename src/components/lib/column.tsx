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

export default function columnProps({
    name,
    property,
    dropdowns,
    tableFilter,
    filterBy,
    changeFieldValue
}: {
    name: string,
    property: {
        widget?: any,
        readOnly?: boolean,
        foreign?: string
    },
    dropdowns: {},
    tableFilter?: TableFilter,
    filterBy?: (name: string, value: string) => (e: {}) => void,
    changeFieldValue?: (rowData: {}, field: string, value: any) => void
}) {
    const {type, dropdown, parent, column, ...props} = property?.widget || {name};
    const fieldName = name;
    let filterElement, body, editor;
    switch (type) {
        case 'boolean':
            filterElement = filterBy && <Checkbox
                checked={tableFilter?.filters?.[property?.foreign || fieldName]?.value}
                onChange={filterBy(property?.foreign || fieldName, 'checked')}
                {...props}
            />;
            body = function body(rowData) {
                const value = rowData[fieldName];
                if (value == null) return null;
                return <i className={`pi ${value ? 'pi-check' : 'pi-times'}`}></i>;
            };
            break;
        case 'dropdown':
            filterElement = filterBy && <Dropdown
                className='w-full'
                options={dropdowns?.[dropdown] || []}
                value={tableFilter?.filters?.[property?.foreign || fieldName]?.value}
                onChange={filterBy(property?.foreign || fieldName, 'value')}
                showClear
                {...props}
            />;
            break;
        case 'date':
            body = function body(rowData) {
                const value = rowData[fieldName];
                if (value == null) return null;
                return new Date(value).toLocaleDateString();
            };
            break;
        case 'time':
            body = function body(rowData) {
                const value = rowData[fieldName];
                if (value == null) return null;
                return new Date(value).toLocaleTimeString();
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
    if (!property?.readOnly && changeFieldValue) {
        editor = function editor(p) {
            const widget = p.rowData?.$pivot?.[fieldName]?.widget || p.rowData?.$pivot?.widget;
            switch (widget?.type || type) {
                case 'boolean':
                    return <Checkbox
                        checked={p.rowData[fieldName]}
                        onChange={e => {
                            changeFieldValue(p.rowData, p.field, e.checked);
                        }}
                        {...props}
                    />;
                case 'dropdown':
                    return <Dropdown
                        className='w-full'
                        options={dropdowns?.[dropdown] || []}
                        value={p.rowData[fieldName]}
                        onChange={e => {
                            changeFieldValue(p.rowData, p.field, e.value);
                        }}
                        showClear
                        {...props}
                    />;
                case 'date':
                    return <Calendar
                        className='w-full'
                        value={new Date(p.rowData[fieldName])}
                        onChange={e => {
                            changeFieldValue(p.rowData, p.field, e.value);
                        }}
                        showIcon
                        {...props}
                    />;
                case 'time':
                    return <Calendar
                        className='w-full'
                        value={new Date(p.rowData[fieldName])}
                        onChange={e => {
                            changeFieldValue(p.rowData, p.field, e.value);
                        }}
                        timeOnly
                        showIcon
                        {...props}
                    />;
                case 'date-time':
                    return <Calendar
                        className='w-full'
                        value={new Date(p.rowData[fieldName])}
                        onChange={e => {
                            changeFieldValue(p.rowData, p.field, e.value);
                        }}
                        showTime
                        showIcon
                        {...props}
                    />;
                case 'mask':
                    return <InputMask
                        className='w-full'
                        value={p.rowData[fieldName]}
                        onChange={e => {
                            changeFieldValue(p.rowData, p.field, e.value);
                        }}
                        {...props}
                    />;
                case 'text':
                    return <InputTextarea
                        className='w-full'
                        autoFocus={true}
                        value={p.rowData[fieldName]}
                        onChange={e => {
                            changeFieldValue(p.rowData, p.field, e.target.value);
                        }}
                        {...props}
                    />;
                default:
                    return <InputText
                        type='text'
                        autoFocus={true}
                        value={p.rowData[fieldName]}
                        onChange={event => {
                            changeFieldValue(p.rowData, p.field, event.target.value);
                        }}
                        disabled={property?.readOnly}
                        className='w-full'
                        id={`${p.rowData.id}`}
                        {...props}
                    />;
            };
        };
    }
    return {
        ...filterElement && {filterElement},
        ...body && {body},
        ...(editor != null) && {editor},
        ...column
    };
}
