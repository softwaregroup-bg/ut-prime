import React from 'react';
import { CheckboxTest, DropdownTest, SelectButton, Calendar, InputMask, InputText, InputTextarea, InputNumber } from '../prime';
import { Property } from '../types';
import titleCase from './titleCase';
import getType from './getType';
import {KEY} from '../Form/const';
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

function timeOrZero(value) {
    if (value == null) return new Date(1970, 0, 1);
    return new Date(value);
}

export default function columnProps({
    resultSet,
    name,
    property,
    widget,
    dropdowns,
    tableFilter,
    filterBy,
    editable
}: {
    resultSet: string,
    name: string,
    property: Property,
    widget?: any,
    dropdowns: {},
    tableFilter?: TableFilter,
    filterBy?: (name: string, value: string) => (e: {}) => void,
    editable?: boolean
}) {
    const resultSetDot = resultSet ? resultSet + '.' : '';
    const {type, dropdown, parent, column, lookup, ...props} = widget || property?.widget || {name};
    const fieldName = name;
    let filterElement, body, editor, className, bodyClassName;
    const filterId = `${resultSetDot}${name}Filter`;
    filterElement = filterBy && <InputText
        {...props}
        name={filterId}
    />;
    switch (type || property?.format || getType(property?.type)) {
        case 'integer':
        case 'number':
            className = 'text-right';
            bodyClassName = 'text-right';
            break;
        case 'boolean':
            filterElement = filterBy && <CheckboxTest
                checked={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'checked')}
                {...props}
                id={filterId}
                name={filterId}
            />;
            body = function body(rowData) {
                const value = rowData[property?.body || fieldName];
                if (value == null) return null;
                return <i className={`pi ${value ? 'pi-check' : 'pi-times'}`}></i>;
            };
            break;
        case 'dropdown':
            filterElement = filterBy && <DropdownTest
                className='w-full'
                options={dropdowns?.[dropdown] || []}
                value={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'value')}
                showClear
                {...props}
                name={filterId}
            />;
            body = function body(rowData) {
                return rowData[property?.body || fieldName];
            };
            break;
        case 'select':
            body = function body(rowData) {
                return <SelectButton
                    className='w-full white-space-nowrap'
                    options={dropdowns?.[dropdown] || []}
                    value={props?.split ? rowData[fieldName]?.split(props.split) : rowData[fieldName]}
                    disabled
                    // onChange={(e) => {}}
                    {...props}
                    name={filterId}
                />;
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
            const inputId = `${resultSet}[${p.rowData[KEY]}].${fieldName}`;
            switch (widget?.type || type || property?.format || getType(property?.type)) {
                case 'boolean':
                    return <CheckboxTest
                        checked={p.rowData[fieldName]}
                        onChange={event => p.editorCallback(event.checked)}
                        id={inputId}
                        {...props}
                        name={inputId}
                    />;
                case 'integer':
                    return <InputNumber
                        autoFocus={true}
                        value={p.rowData[fieldName]}
                        onChange={event => p.editorCallback(event.value)}
                        disabled={property?.readOnly}
                        className='w-full'
                        showButtons
                        inputId={inputId}
                        {...props}
                        name={inputId}
                    />;
                case 'dropdown':
                    return <DropdownTest
                        className='w-full'
                        options={dropdowns?.[dropdown] || []}
                        value={p.rowData[fieldName]}
                        onChange={event => {
                            if (lookup) {
                                const item = dropdowns?.[dropdown]?.find(({value}) => value === event.value);
                                item && Object.entries(lookup).forEach(([key, value]) => {
                                    if (typeof value === 'string') p.rowData[value] = item[key];
                                });
                            } else if (property?.body) {
                                const item = dropdowns?.[dropdown]?.find(({value}) => value === event.value);
                                p.rowData[property?.body] = item?.label;
                            }
                            p.editorCallback(event.value);
                        }}
                        showClear
                        inputId={inputId}
                        {...props}
                        name={inputId}
                    />;
                case 'select':
                    return <SelectButton
                        className='w-full white-space-nowrap'
                        options={dropdowns?.[dropdown] || []}
                        value={props?.split ? p.rowData[fieldName]?.split(props.split).filter(Boolean) : p.rowData[fieldName]}
                        onChange={event => p.editorCallback(props?.split ? event.value.join(props.split) || null : event.value)}
                        id={inputId}
                        {...props}
                        name={inputId}
                    />;
                case 'date':
                    return <Calendar
                        showOnFocus={false}
                        value={dateOrNull(p.rowData[fieldName])}
                        onChange={event => p.editorCallback(event.value)}
                        showIcon
                        inputId={inputId}
                        {...props}
                        name={inputId}
                    />;
                case 'time':
                    return <Calendar
                        showOnFocus={false}
                        value={timeOrZero(p.rowData[fieldName])}
                        onChange={event => p.editorCallback(event.value)}
                        timeOnly
                        showIcon
                        inputId={inputId}
                        {...props}
                        name={inputId}
                    />;
                case 'date-time':
                    return <Calendar
                        showOnFocus={false}
                        value={dateOrNull(p.rowData[fieldName])}
                        onChange={event => p.editorCallback(event.value)}
                        showTime
                        showIcon
                        inputId={inputId}
                        {...props}
                        name={inputId}
                    />;
                case 'mask':
                    return <InputMask
                        className='w-full'
                        value={p.rowData[fieldName] ?? ''}
                        onChange={event => p.editorCallback(event.value)}
                        id={inputId}
                        {...props}
                        name={inputId}
                    />;
                case 'text':
                    return <InputTextarea
                        className='w-full'
                        autoFocus={true}
                        value={p.rowData[fieldName] ?? ''}
                        onChange={event => p.editorCallback(event.target.value)}
                        id={inputId}
                        {...props}
                        name={inputId}
                    />;
                default:
                    return <InputText
                        type='text'
                        autoFocus={true}
                        value={p.rowData[fieldName] ?? ''}
                        onChange={event => p.editorCallback(event.target.value)}
                        disabled={property?.readOnly}
                        className='w-full'
                        id={inputId}
                        {...props}
                        name={inputId}
                    />;
            };
        };
    }
    return {
        showClearButton: true,
        showFilterMenu: false,
        field: name,
        header: <span data-testid={`${resultSetDot}${name}Title`}>{property?.title || titleCase(name.split('.').pop())}</span>,
        ...filterElement && {filterElement},
        ...body && {body},
        ...(editor != null) && {editor},
        className,
        bodyClassName,
        ...column
    };
}
