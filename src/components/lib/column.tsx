import React from 'react';
import {
    Calendar,
    Checkbox,
    DateRange,
    Dropdown,
    FileUpload,
    InputMask,
    InputNumber,
    InputText,
    InputTextarea,
    Password,
    RadioButton,
    SelectButton
} from '../prime';
import type { Property, PropertyEditor } from '../types';
import titleCase from './titleCase';
import getType from './getType';
import {KEY, INDEX} from '../Card/const';
import testid from '../lib/testid';
import {ConfigField} from '../Form/DragDrop';
import Text from '../Text';
import clsx from 'clsx';

export interface TableFilter {
    filters?: {
        [name: string]: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    editable,
    index,
    card,
    design,
    inspected,
    onInspect,
    move,
    toolbar
}: {
    resultSet: string,
    name: string,
    property: Property,
    widget?: PropertyEditor,
    dropdowns: object,
    tableFilter?: TableFilter,
    filterBy?: (name: string, value: string) => (e: object) => void,
    editable?: boolean,
    index: number,
    card?: string,
    design?: boolean,
    inspected?: unknown,
    onInspect?: unknown,
    move?: undefined,
    toolbar?: undefined
}) {
    const resultSetDot = resultSet ? resultSet + '.' : '';
    const {type, dropdown, parent, column, lookup, compare, ...props} = widget || property?.widget || {name};
    const fieldName = name.split('.').pop();
    let filterElement, body, editor, bodyClassName, alignHeader;
    const filterId = `${resultSetDot}${name}Filter`;
    filterElement = filterBy && <InputText
        {...props}
        value={tableFilter?.filters?.[fieldName]?.value ?? ''}
        onChange={filterBy(fieldName, 'target.value')}
        name={filterId}
    />;
    switch (type || property?.format || getType(property?.type)) {
        case 'integer':
        case 'number':
            alignHeader = 'right';
            bodyClassName = 'text-right';
            break;
        case 'boolean':
            filterElement = filterBy && <Checkbox
                checked={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'checked')}
                {...testid(filterId)}
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
            filterElement = filterBy && <Dropdown
                className='w-full'
                options={dropdowns?.[dropdown] || []}
                value={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'value')}
                showClear
                {...testid(filterId)}
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
        case 'radio':
            body = function body(rowData) {
                return <RadioButton
                    checked={rowData[fieldName]}
                    disabled
                    {...testid(props.id)}
                    // onChange={(e) => {}}
                    {...props}
                    name={filterId}
                />;
            };
            break;
        case 'select-table-radio':
            body = function body(rowData, {props}) {
                return <RadioButton
                    checked={rowData[fieldName]}
                    disabled={!props?.selection?.filter(selected => selected[props.dataKey] === rowData[props.dataKey])?.length}
                    onChange={event => {
                        const index = props.value.findIndex(e => e[props.dataKey] === rowData[props.dataKey]);
                        const data = {...rowData, [INDEX]: index};
                        rowData[fieldName] = event.checked;
                        return props.onRowEditComplete({data, newData: rowData});
                    }}
                    {...testid(props.id)}
                    className=""
                    name={filterId}
                />;
            };
            break;
        case 'date':
            filterElement = filterBy && <DateRange
                value={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'value')}
                {...testid(filterId)}
                {...props}
                id={filterId}
                name={filterId}
            />;
            body = function body(rowData) {
                return dateOrNull(rowData[fieldName])?.toLocaleDateString();
            };
            break;
        case 'time':
            filterElement = filterBy && <DateRange
                value={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'value')}
                showTime
                showSeconds
                timeOnly
                {...testid(filterId)}
                {...props}
                id={filterId}
                name={filterId}
            />;
            body = function body(rowData) {
                return dateOrNull(rowData[fieldName])?.toISOString().slice(11, 19);
            };
            break;
        case 'date-time':
            filterElement = filterBy && <DateRange
                value={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'value')}
                showTime
                showSeconds
                {...testid(filterId)}
                {...props}
                id={filterId}
                name={filterId}
            />;
            body = function body(rowData) {
                const value = rowData[fieldName];
                if (value == null) return null;
                return new Date(value).toLocaleString();
            };
            break;
        case 'password': {
            body = function body(rowData) {
                return rowData[fieldName]
                    ? '*'.repeat(10)
                    : '';
            };
            break;
        }
        case 'file': {
            body = function body(rowData) {
                return [].concat(rowData[fieldName]).filter(Boolean)?.map(({name}) => name).join(', ');
            };
        }
    }
    if (compare) {
        const oldBody = body;
        body = function bodyCompare(rowData) {
            const value0 = rowData[fieldName];
            const value1 = rowData[compare];
            if (value0 !== value1) {
                return <>
                    <div style={{color: 'var(--teal-500)'}}>{(oldBody ? oldBody(rowData) : value0) ?? <>&nbsp;</>}</div>
                    <div style={{color: 'var(--orange-500)'}}>{(oldBody ? oldBody({[fieldName]: value1}) : value1) ?? <>&nbsp;</>}</div>
                </>;
            } else return oldBody ? oldBody({[fieldName]: value0}) : value0;
        };
    }
    if (!property?.readOnly && editable) {
        editor = function editor(p) {
            const widget = p.rowData?.$pivot?.[fieldName]?.widget || p.rowData?.$pivot?.widget;
            const inputName = `${resultSet}[${p.rowData[KEY]}].${fieldName}`;
            const inputId = `${resultSet}-${p.rowData[KEY]}-${fieldName}`;
            switch (widget?.type || type || property?.format || getType(property?.type)) {
                case 'file':
                    return <FileUpload
                        onSelect={e => p.editorCallback([...e.files || []])}
                        disabled={property?.readOnly}
                        mode='basic'
                        id={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'boolean':
                    return <Checkbox
                        checked={p.rowData[fieldName]}
                        onChange={event => p.editorCallback(event.checked)}
                        id={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'integer':
                    return <InputNumber
                        value={p.rowData[fieldName]}
                        onChange={event => p.editorCallback(event.value)}
                        disabled={property?.readOnly}
                        className='w-full'
                        showButtons
                        inputId={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'dropdown':
                    return <Dropdown
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
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'select':
                    return <SelectButton
                        className='w-full white-space-nowrap'
                        options={dropdowns?.[dropdown] || []}
                        value={props?.split ? p.rowData[fieldName]?.split(props.split).filter(Boolean) : p.rowData[fieldName]}
                        onChange={event => p.editorCallback(props?.split ? event.value.join(props.split) || null : event.value)}
                        id={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'radio':
                    return <RadioButton
                        checked={p.rowData[fieldName]}
                        onChange={event => p.editorCallback(event.checked)}
                        inputId={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'date':
                    return <Calendar
                        showOnFocus={false}
                        value={dateOrNull(p.rowData[fieldName])}
                        onChange={event => p.editorCallback(event.value)}
                        showIcon
                        inputId={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'time':
                    return <Calendar
                        showOnFocus={false}
                        value={timeOrZero(p.rowData[fieldName])}
                        onChange={event => p.editorCallback(event.value)}
                        timeOnly
                        showIcon
                        inputId={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'date-time':
                    return <Calendar
                        showOnFocus={false}
                        value={dateOrNull(p.rowData[fieldName])}
                        onChange={event => p.editorCallback(event.value)}
                        showTime
                        showIcon
                        inputId={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'mask':
                    return <InputMask
                        className='w-full'
                        value={p.rowData[fieldName] ?? ''}
                        onChange={event => p.editorCallback(event.value)}
                        id={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'password':
                    return <Password
                        value={p.rowData[fieldName]}
                        onInput={event => p.editorCallback(event.currentTarget.value)}
                        id={inputId}
                        feedback={false}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'text':
                    return <InputTextarea
                        className='w-full'
                        autoFocus={true}
                        value={p.rowData[fieldName] ?? ''}
                        onChange={event => p.editorCallback(event.target.value)}
                        id={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
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
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
            }
        };
    }
    const label = property?.title || titleCase(name.split('.').pop());
    widget = widget || property?.widget;
    return {
        showClearButton: true,
        showFilterMenu: false,
        field: fieldName,
        ...widget?.labelClass && {headerClassName: widget.labelClass},
        header: <ConfigField
            design={design}
            relative={false}
            name={name}
            index={index}
            label={index}
            key={name}
            card={card}
            move={move}
            onInspect={onInspect}
            inspected={inspected}
            type='column'
        >
            <span {...testid(`${resultSetDot}${name}Title`)}><Text>{label}</Text></span>
        </ConfigField>,
        ...filterElement && {filterElement},
        ...body && {body},
        ...(editor != null) && {editor},
        alignHeader,
        bodyClassName: clsx(bodyClassName, widget?.fieldClass),
        ...column
    };
}
