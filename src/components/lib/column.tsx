import React from 'react';
import {
    Calendar,
    Checkbox,
    Dropdown,
    FileUpload,
    InputMask,
    InputNumber,
    InputText,
    InputTextarea,
    MultiSelect,
    Password,
    RadioButton,
    SelectButton,
    TriStateCheckbox
} from '../prime';
import DateRange from '../DateRange';
import Json from '../Json';
import type { Property, PropertyEditor } from '../types';
import titleCase from './titleCase';
import getType from './getType';
import {KEY, INDEX, CHANGE} from '../Card/const';
import testid from '../lib/testid';
import {ConfigField} from '../Form/DragDrop';
import Text from '../Text';
import clsx from 'clsx';
import type Joi from 'joi';
import { TooltipProps } from 'primereact/tooltip';
import type { ContextType } from '../Text/context';
import type { FormatOptions } from '../Gate/Gate.types';

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

function range(value) {
    return Array.isArray(value)
        ? JSON.stringify(value)
        : value;
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
    getValues,
    filterErrors,
    errorsWithoutColumn,
    toolbar,
    ctx
}: {
    resultSet?: string,
    name: string,
    property: Property,
    widget?: PropertyEditor,
    dropdowns: object,
    tableFilter?: Omit<TableFilter, 'page'>,
    filterBy?: (name: string, value: string) => (e: object) => void,
    editable?: boolean,
    index: number,
    card?: string,
    design?: boolean,
    inspected?: unknown,
    onInspect?: unknown,
    getValues?: (fieldName: string | string[]) => unknown,
    move?: unknown,
    filterErrors?: Joi.ValidationError,
    errorsWithoutColumn?: Joi.ValidationError['details']
    toolbar?: undefined,
    ctx: ContextType
}) {
    const resultSetDot = resultSet ? resultSet + '.' : '';
    const { type, dropdown, parent, column, lookup, compare, download, basePath, optionsFilter, pathField = 'hash', translation, formatOptions, inlineEdit, ...props } = widget || property?.widget || { name };
    const fieldName = name.split('.').pop();
    let filterElement, body, editor, bodyClassName, alignHeader;
    const filterId = `${resultSetDot}${name}Filter`;
    const isInvalid = filterErrors?.details?.findIndex(({path}) => [fieldName, name].includes(path.join('.')));
    const widgetType = type || property?.format || getType(property?.type);
    const invalidProps = isInvalid >= 0 ? {
        className: clsx(props.className || (widgetType === 'dropdown' && 'w-full'), 'p-invalid'),
        tooltip: filterErrors.details[isInvalid].message,
        tooltipOptions: {
            position: 'top',
            event: 'both'
        } as TooltipProps
    } : {};
    if (filterBy && isInvalid >= 0) delete errorsWithoutColumn[isInvalid];
    filterElement = filterBy && <InputText
        {...props}
        {...invalidProps}
        value={tableFilter?.filters?.[fieldName]?.value ?? ''}
        onChange={filterBy(fieldName, 'target.value')}
        name={filterId}
    />;
    body = function body(rowData) {
        const value = rowData[property?.body || fieldName];
        return (value == null) ? value : <span className='value'>{translation ? <Text>{value}</Text> : value}</span>;
    };
    const parentValue = parent && getValues?.(parent);
    const filterByDdlOpts = item => (!parent && !optionsFilter) || !getValues || Object.entries({...optionsFilter, parent: parentValue}).every(([name, value]) => String(item[name]) === String(value));

    switch (widgetType) {
        case 'currency':
        case 'integer':
        case 'number':
            alignHeader = 'right';
            bodyClassName = 'text-right';
            break;
        case 'boolean':
            filterElement = filterBy && <TriStateCheckbox
                value={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'value')}
                {...testid(filterId)}
                {...props}
                {...invalidProps}
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
                options={[].concat(dropdowns?.[dropdown]).filter(Boolean).filter(filterByDdlOpts)}
                value={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'value')}
                showClear
                {...testid(filterId)}
                {...props}
                {...invalidProps}
                name={filterId}
            />;
            body = function body(rowData) {
                return rowData[property?.body || fieldName];
            };
            break;
        case 'multiSelect':
            body = function body(rowData) {
                return <MultiSelect
                    className='w-full'
                    options={dropdowns?.[dropdown] || []}
                    value={rowData[fieldName]}
                    disabled
                    display='chip'
                    {...props}
                    name={filterId}
                />;
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
        case 'json':
            body = function body(rowData) {
                return <span className='value'><Json
                    value={rowData[fieldName]}
                    {...testid(props.id)}
                    {...props}
                /></span>;
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
                value={range(tableFilter?.filters?.[fieldName]?.value)}
                onChange={filterBy(fieldName, 'value')}
                {...testid(filterId)}
                {...props}
                {...invalidProps}
                id={filterId}
                name={filterId}
            />;
            body = function body(rowData) {
                let value = rowData[fieldName];
                if (value == null) return null;
                value = new Date(value);
                return ctx?.formatValue?.(new Date(value.getTime() + value.getTimezoneOffset() * 60 * 1000), { type: 'date', ...(formatOptions as FormatOptions)?.date });
            };
            break;
        case 'time':
            filterElement = filterBy && <DateRange
                value={range(tableFilter?.filters?.[fieldName]?.value)}
                onChange={filterBy(fieldName, 'value')}
                timeOnly
                {...testid(filterId)}
                {...props}
                {...invalidProps}
                id={filterId}
                name={filterId}
            />;
            body = function body(rowData) {
                const value = dateOrNull(rowData[fieldName]);
                return ctx?.formatValue?.(value, { type: 'time', ...(formatOptions as FormatOptions)?.time });
            };
            break;
        case 'date-time':
            filterElement = filterBy && <DateRange
                value={range(tableFilter?.filters?.[fieldName]?.value)}
                onChange={filterBy(fieldName, 'value')}
                {...testid(filterId)}
                {...props}
                {...invalidProps}
                id={filterId}
                name={filterId}
            />;
            body = function body(rowData) {
                const value = dateOrNull(rowData[fieldName]);
                return ctx?.formatValue?.(value, { type: 'dateTime', ...(formatOptions as FormatOptions)?.dateTime });
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
                const disabledDownload = [].concat(rowData[fieldName]).filter(Boolean)?.map((item) => item?.name || item).join(', ');

                const enabledDownload = () => {
                    let label = '';
                    let url = '';

                    const anchors = [].concat(rowData[fieldName]).filter(Boolean)?.map((item, i) => {
                        label = item?.name || item;
                        url = item?.objectURL ?? (rowData[pathField as string] ? (basePath || '') + rowData[pathField as string] : null);

                        return <span key={i}>{i > 0 && ', '}<a href={url} download={label} style={{ color: 'inherit' }}>{label}</a></span>;
                    });
                    return anchors;
                };

                return download ? enabledDownload() : disabledDownload;
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
                    <div className='value' style={{color: 'var(--teal-500)'}}>{(oldBody ? oldBody(rowData) : value0) ?? <>&nbsp;</>}</div>
                    <div className='value' style={{color: 'var(--orange-500)'}}>{(oldBody ? oldBody({[fieldName]: value1}) : value1) ?? <>&nbsp;</>}</div>
                </>;
            } else return oldBody ? oldBody({[fieldName]: value0}) : value0;
        };
    }
    if (!property?.readOnly && editable) {
        editor = function editor(p) {
            const widget = p.rowData?.$pivot?.[fieldName]?.widget || p.rowData?.$pivot?.widget;
            const inputName = inlineEdit ? `${resultSet}[${p[KEY]}].${fieldName}` : `${resultSet}[${p.rowData[KEY]}].${fieldName}`;
            const inputId = inlineEdit ? `${resultSet}-${p[KEY]}-${fieldName}` : `${resultSet}-${p.rowData[KEY]}-${fieldName}`;

            function dataValue(inlineEdit, fieldName) {
                return inlineEdit ? p[fieldName] : p.rowData[fieldName];
            }

            function onEdit(inlineEdit, event, usedProp) {
                if (!inlineEdit) {
                    p.editorCallback(usedProp);
                } else {
                    if (usedProp !== p[fieldName]) {
                        event.data = p;
                        event.newData = {...p, [fieldName]: usedProp};
                    }
                    p[CHANGE](event);
                }
            }

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
                        checked={dataValue(inlineEdit, fieldName)}
                        onChange={event => onEdit(inlineEdit, event, event.checked)}
                        id={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'integer':
                    return <InputNumber
                        value={dataValue(inlineEdit, fieldName)}
                        onChange={event => onEdit(inlineEdit, event, event.value)}
                        disabled={property?.readOnly}
                        className='w-full'
                        inputClassName='w-full text-right'
                        showButtons
                        inputId={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'number':
                    return <InputNumber
                        value={dataValue(inlineEdit, fieldName)}
                        onChange={event => onEdit(inlineEdit, event, event.value)}
                        disabled={property?.readOnly}
                        className='w-full'
                        inputClassName='w-full text-right'
                        inputId={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'currency':
                    return <InputNumber
                        value={(dataValue(inlineEdit, fieldName))}
                        onChange={event => onEdit(inlineEdit, event, event.value)}
                        disabled={property?.readOnly}
                        className='w-full'
                        inputClassName='w-full text-right'
                        inputId={inputId}
                        minFractionDigits={2}
                        maxFractionDigits={4}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'dropdown':
                    return <Dropdown
                        className='w-full'
                        options={[].concat(dropdowns?.[dropdown]).filter(Boolean).filter(filterByDdlOpts)}
                        value={(dataValue(inlineEdit, fieldName))}
                        onChange={event => {
                            if (lookup) {
                                const item = dropdowns?.[dropdown]?.find(({value}) => value === event.value);
                                item && Object.entries(lookup).forEach(([key, value]) => {
                                    if (typeof value === 'string') {
                                        if (inlineEdit) {
                                            p[value] = item[key];
                                        } else {
                                            p.rowData[value] = item[key];
                                        }
                                    }
                                });
                            } else if (property?.body) {
                                const item = dropdowns?.[dropdown]?.find(({value}) => value === event.value);
                                if (inlineEdit) {
                                    p[property?.body] = item?.label;
                                } else {
                                    p.rowData[property?.body] = item?.label;
                                }
                            }
                            onEdit(inlineEdit, event, event.value);
                        }}
                        showClear
                        inputId={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'multiSelect':
                    return <MultiSelect
                        className='w-full'
                        options={[].concat(dropdowns?.[dropdown]).filter(Boolean).filter(filterByDdlOpts)}
                        value={p.rowData[fieldName]}
                        onChange={event => {
                            if (property?.body) {
                                const items = dropdowns?.[dropdown]?.find(({value}) => event?.value?.includes(value)).map(({label}) => label);
                                p.rowData[property?.body] = items?.join(', ');
                            }
                            p.editorCallback(event.value);
                        }}
                        showClear
                        display='chip'
                        inputId={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'select':
                    return <SelectButton
                        className='w-full white-space-nowrap'
                        options={[].concat(dropdowns?.[dropdown]).filter(Boolean).filter(filterByDdlOpts)}
                        value={props?.split ? p.rowData[fieldName]?.split(props.split).filter(Boolean) : p.rowData[fieldName]}
                        onChange={event => p.editorCallback(props?.split ? event.value.join(props.split) || null : event.value)}
                        id={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'radio':
                    return <RadioButton
                        checked={(dataValue(inlineEdit, fieldName))}
                        onChange={event => onEdit(inlineEdit, event, event.checked)}
                        inputId={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'date':
                    return <Calendar
                        showOnFocus={false}
                        value={(() => {
                            const value = dataValue(inlineEdit, fieldName);
                            return value != null
                                ? new Date(new Date(value).getTime() + new Date(value).getTimezoneOffset() * 60 * 1000)
                                : value;
                        })()}
                        onChange={event => {
                            if (event.value instanceof Date) event.value = new Date(event.value.getTime() - event.value.getTimezoneOffset() * 60 * 1000);
                            onEdit(inlineEdit, event, event.value);
                        }}
                        showIcon
                        inputId={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'time':
                    return <Calendar
                        showOnFocus={false}
                        value={timeOrZero(dataValue(inlineEdit, fieldName))}
                        onChange={event => onEdit(inlineEdit, event, event.value)}
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
                        value={dateOrNull(dataValue(inlineEdit, fieldName))}
                        onChange={event => onEdit(inlineEdit, event, event.value)}
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
                        className='w-full'
                        inputClassName='w-full'
                        feedback={false}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                case 'text':
                    return <InputTextarea
                        className='w-full'
                        autoFocus={true}
                        value={(dataValue(inlineEdit, fieldName)) ?? ''}
                        onChange={event => onEdit(inlineEdit, event, event.target.value)}
                        id={inputId}
                        {...testid(inputId)}
                        {...props}
                        name={inputName}
                    />;
                default:
                    return <InputText
                        type='text'
                        autoFocus={true}
                        value={(dataValue(inlineEdit, fieldName)) ?? ''}
                        onChange={event => onEdit(inlineEdit, event, event.target.value)}
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
        ...body && (inlineEdit ? {body: editor} : {body}),
        ...(editor != null) && {editor},
        alignHeader,
        bodyClassName: clsx(bodyClassName, widget?.fieldClass),
        ...column
    };
}
