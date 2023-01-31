import React, { useContext } from 'react';
import clsx from 'clsx';
import { RefCallBack } from 'react-hook-form';
import get from 'lodash.get';

import {
    AutoComplete,
    Calendar,
    Checkbox,
    Chips,
    Column,
    Dropdown,
    FileUpload,
    GMap,
    Image,
    InputMask,
    InputNumber,
    InputText,
    InputTextarea,
    MultiSelect,
    Password,
    SelectButton,
    Skeleton,
    TreeSelect,
    TreeTable
} from '../prime';
import {PropertyEditor, FormApi} from '../types';
import Context from '../Text/context';

import getType from '../lib/getType';
import testid from '../lib/testid';
import Table from './inputs/Table';
import Ocr from './inputs/Ocr';
import ActionButton from '../ActionButton';
import DateRange from '../DateRange';
import Json from '../Json';
import Component from '../Component';
import {CHANGE} from './const';
import Controller from '../Controller';

const getFieldClass = (index, classes, name, className) =>
    name === '' ? className : clsx(
        'flex align-items-center relative col-12', {
            ...classes?.default,
            ...classes?.[name]
        }.field || ((index.properties[name]?.title !== '' || className) && (className || 'md:col-8'))
    );

const noActions = {allowAdd: false, allowEdit: false, allowDelete: false};

const Field = ({children = undefined, label = undefined, error = undefined, inputClass = undefined}) => <>
    {label}
    <div className={inputClass}>{children}</div>
    {error}
</>;

const Clear = ({showClear, field}) =>
    (showClear && field.value !== undefined)
        ? <div className='absolute flex right-0 top-0 bottom-0 justify-content-center align-items-center m-2' style={{width: '2.375rem'}}>
            <i onClick={e => field.onChange({...e, value: undefined})} className={`pi cursor-pointer ${showClear === true ? 'pi-times' : showClear}`}></i>
        </div>
        : null;

function input(
    label,
    error,
    field: {
        onChange: (...event: unknown[]) => void;
        onBlur: () => void;
        value: any;
        name: string;
        ref: RefCallBack;
        className: string;
    },
    inputClass,
    widgetClassName,
    {
        type,
        dropdown = '',
        parent: parentField = '',
        optionsFilter = null,
        title = '',
        columns,
        clear,
        ...props
    }: PropertyEditor = {id: field?.name},
    schema,
    dropdowns,
    parentValue,
    loading: string,
    formApi: FormApi,
    counter,
    methods,
    submit,
    defaultWidgetType,
    context
) {
    const widgetType = type || defaultWidgetType || schema?.format || getType(schema?.type);
    if (loading) {
        if (loading === 'loading' && ['button', 'submit'].includes(widgetType)) return <ActionButton className={inputClass ?? 'mr-2'} {...props} disabled />;
        if (loading === 'loading') return <>{label}<div className={inputClass}><Skeleton className='p-inputtext'/></div></>;
    }
    props.disabled ??= schema?.readOnly || (parentField && !parentValue);
    if (loading) props.disabled = true;
    const filterBy = item => (!parentField && !optionsFilter) || Object.entries({...optionsFilter, parent: parentValue}).every(([name, value]) => String(item[name]) === String(value));

    switch (widgetType) {
        case 'button': return <ActionButton
            className={inputClass ?? 'mr-2'}
            {...props}
            getValues={formApi.getValues}
        >{title}</ActionButton>;
        case 'submit': return <ActionButton
            className={inputClass ?? 'mr-2'}
            {...props}
            submit={submit}
        >{title}</ActionButton>;
        case 'dropdownTree': return <Field {...{label, error, inputClass}}>
            <TreeSelect
                {...field}
                value={field.value == null ? field.value : String(field.value)}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                inputId={props.id}
                {...testid(field.name)}
                {...props}
            />
        </Field>;
        case 'chips': return <Field {...{label, error, inputClass}}>
            <Chips
                {...field}
                value={field.value?.split(' ').filter(Boolean) || []}
                onChange={e => field.onChange?.({...e, value: e.value.length ? e.value.join(' ') : null})}
                {...props}
            />
            <Clear field={field} showClear={clear}/>
        </Field>;
        case 'text': return <Field {...{label, error, inputClass}}>
            <InputTextarea
                {...field}
                onChange={e => field.onChange?.({...e, value: e.target.value || null})}
                value={field.value || ''}
                {...props}
            />
            <Clear field={field} showClear={clear}/>
        </Field>;
        case 'mask': return <Field {...{label, error, inputClass}}>
            <InputMask
                {...field}
                value={field.value || ''}
                {...props}
            />
        </Field>;
        case 'json':
        case 'jsonView': return <Field {...{label, error, inputClass}}>
            <Json
                {...field}
                value={field.value || ''}
                {...parentField && {previous: parentValue}}
                {...props}
            />
        </Field>;
        case 'currency': {
            const currencyValue = parentValue || props?.currency;
            const scale = currencyValue && context?.getScale?.(currencyValue);
            const [minFractionDigits = 2, maxFractionDigits = 4] = [scale, scale];

            return <Field {...{label, error, inputClass}}>
                <InputNumber
                    {...field}
                    inputClassName='text-right'
                    inputRef={field.ref}
                    minFractionDigits={minFractionDigits}
                    maxFractionDigits={maxFractionDigits}
                    inputId={props.id}
                    {...props}
                />
            </Field>;
        }
        case 'boolean': return <Field {...{label, error, inputClass}}>
            <Checkbox
                {...field}
                inputRef={field.ref}
                onChange={e => field.onChange?.({...e, value: e.checked})}
                checked={field.value}
                inputId={props.id}
                {...testid(props.id)}
                {...props}
            />
            <Clear field={field} showClear={clear}/>
        </Field>;
        case 'table': return <>
            {error}
            {label}
            <div className={inputClass}>
                <div className='w-full'>
                    <Table
                        {...field}
                        parent={parentValue}
                        properties={schema?.items?.properties}
                        dropdowns={dropdowns}
                        getValues={formApi.getValues}
                        methods={methods}
                        counter={counter}
                        formApi={formApi}
                        {...props.selectionPath && formApi.getValues && {selection: formApi.getValues(`${props.selectionPath}.${field.name}`) || []}}
                        {...props}
                    />
                </div>
            </div>
        </>;
        case 'autocomplete': {
            const handleSelect = event => field.onChange?.({...event, value: event.value});
            const handleClear = event => field.onChange?.({...event, value: {}});
            const itemTemplate = item => Array.isArray(columns)
                ? <div className='grid grid-nogutter'>{
                    columns.map((column, index) => {
                        const {name, className = undefined} = typeof column === 'string' ? {name: column} : column;
                        return <div className={className || 'col'} key={index}>{item?.[name]}</div>;
                    })
                }</div>
                : item?.label;
            const template = ({label}) => label;
            return <Field {...{label, error, inputClass}}>
                <AutoComplete
                    {...field}
                    {...testid(props.id)}
                    inputClassName='w-full'
                    suggestions={field.value?.suggestions}
                    methods={methods}
                    value={field.value?.value}
                    onSelect={handleSelect}
                    onChange={event => field.onChange?.({...event, value: {value: event.value || null}})}
                    onClear={handleClear}
                    itemTemplate={itemTemplate}
                    selectedItemTemplate={template}
                    {...props}
                />
            </Field>;
        }
        case 'dropdown': return <Field {...{label, error, inputClass}}>
            <Dropdown
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                {...testid(field.name)}
                {...props}
            />
        </Field>;
        case 'multiSelect': return <Field {...{label, error, inputClass}}>
            <MultiSelect
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                display='chip'
                {...testid(field.name)}
                {...props}
            />
        </Field>;
        case 'select': return <Field {...{label, error, inputClass}}>
            <SelectButton
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                value={props?.split ? field.value?.split(props.split).filter(Boolean) : field.value}
                onChange={event => field.onChange?.({...event, value: props?.split ? event.value.join(props.split) || null : event.value})}
                {...testid(props.id)}
                {...props}
            />
        </Field>;
        case 'multiSelectTree': return <Field {...{label, error, inputClass}}>
            <TreeSelect
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                display='chip'
                selectionMode='multiple'
                metaKeySelection={false}
                onChange={e => {
                    field.onChange?.({...e, value: Object.keys(e.value)});
                }}
                {...testid(field.name)}
                value={field.value?.map && Object.fromEntries(field.value?.map(value => [value, true]))}
                {...props}
            />
        </Field>;
        case 'multiSelectPanel': return <Field {...{label, error, inputClass}}>
            <MultiSelect
                {...field}
                value={props?.split ? field.value?.split(props.split).filter(Boolean) : field.value}
                onChange={event => field.onChange?.({...event, value: props?.split ? event.value.join(props.split) || null : event.value})}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                {...testid(props.id)}
                inline
                flex
                itemClassName='col-3'
                {...typeof columns === 'string' && {itemClassName: [undefined, 'w-12', 'w-6', 'w-4', 'w-3', undefined, 'w-2'][columns]}}
                {...props}
            />
        </Field>;
        case 'selectTable': {
            const all = dropdowns?.[dropdown];
            const paramSet = Boolean(props.widgets?.length);
            const dataKey = props.dataKey || 'value';
            const value = (all?.filter(filterBy) || []).map(value => {
                if (!paramSet || !field.value) return value;
                return {
                    ...field.value.find(v => v[dataKey] === value[dataKey]) || {},
                    ...value
                };
            });
            const valueKeys = value.map(item => item[dataKey]);
            const single = props.selectionMode === 'single';
            const hidden = !single && (field.value || []).filter(item => paramSet ? !valueKeys.includes(item[dataKey]) : !valueKeys.includes(item));
            const selection = single
                ? paramSet
                    ? value.find(row => row?.[dataKey] === field.value[dataKey])
                    : value.find(row => row?.[dataKey] === field.value)
                : paramSet
                    ? value.filter(row => field.value?.filter(v => v[dataKey] === row?.[dataKey]).length)
                    : value.filter(row => field.value?.includes(row?.[dataKey]));
            return <>
                {error}
                {label}
                <div className={inputClass}>
                    <Table
                        {...field}
                        actions={noActions}
                        dataKey={dataKey}
                        value={value}
                        properties={schema?.items?.properties}
                        selection={selection}
                        onSelectionChange={event => {
                            if (props.disabled) return;
                            if (!paramSet) {
                                return field.onChange?.({
                                    ...event,
                                    value: single
                                        ? event.value[dataKey]
                                        : [].concat(hidden, event.value?.map(row => row?.[dataKey]))
                                }, {children: false, ...props.change});
                            }
                            if (!value?.length) {
                                return field.onChange?.({
                                    ...event,
                                    value: [].concat(
                                        hidden,
                                        event.value
                                    )
                                }, {children: false, ...props.change});
                            }
                            for (const widget of props.widgets) {
                                const key = typeof widget === 'string' ? widget : widget.name;
                                const setWidgetIndex = value.findIndex(e => e[key]);
                                if (setWidgetIndex > -1 && !event.value.find(e => e[key])) {
                                    delete value[setWidgetIndex][key];
                                }
                            }
                            return field.onChange?.({
                                ...event,
                                value: [].concat(
                                    hidden,
                                    value?.filter?.(fv => event.value?.findIndex?.(v => fv[dataKey] === v[dataKey]) > -1),
                                    event.value.filter?.(v => value?.findIndex?.(fv => fv[dataKey] === v[dataKey]) < 0)
                                ).filter(Boolean)
                            }, {children: false, ...props.change});
                        }}
                        onChange={event =>
                            !props.disabled && field.onChange?.({
                                ...event,
                                value: event.value?.filter(e => selection.findIndex(s => s[dataKey] === e[dataKey]) > -1)
                            }, {children: false, ...props.change})
                        }
                        {...props}
                        className={clsx(field.className || props.className, props.disabled && 'p-disabled')}
                    >
                        {!props.widgets?.some(
                            widget => typeof widget === 'string' ? widget === 'label' : widget?.name === 'label'
                        ) ? <Column field='label' header={title}/> : null}
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
                    onChange={undefined}
                    onSelectionChange={e => field.onChange?.({...e, value: e.value})}
                    selectionMode='checkbox'
                    {...testid(props.id)}
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
                showSeconds
                value={field.value != null ? new Date(field.value) : field.value}
                inputId={props.id}
                {...props}
            />
        </Field>;
        case 'time': return <Field {...{label, error, inputClass}}>
            <Calendar
                {...field}
                timeOnly
                showIcon
                value={field.value != null ? new Date(field.value) : field.value}
                inputId={props.id}
                {...props}
            />
        </Field>;
        case 'date': return <Field {...{label, error, inputClass}}>
            <Calendar
                {...field}
                showIcon
                value={
                    field.value != null
                        ? new Date(new Date(field.value).getTime() + new Date(field.value).getTimezoneOffset() * 60 * 1000)
                        : field.value
                }
                onChange={
                    event => {
                        if (event.value instanceof Date) event.value = new Date(event.value.getTime() - event.value.getTimezoneOffset() * 60 * 1000);
                        field.onChange(event);
                    }
                }
                inputId={props.id}
                {...props}
            />
        </Field>;
        case 'dateRange':
            return <Field {...{label, error, inputClass}}>
                <DateRange
                    {...field}
                    value={field.value
                        ? field.value.map(v => typeof v === 'string' ? new Date(v) : v)
                        : field.value}
                    {...props}
                    onChange={event => {
                        if (event?.value?.[1]) {
                            event.value[1].setHours(23, 59, 59, 999);
                        }
                        field.onChange(event);
                    }}
                />
            </Field>;
        case 'number': return <Field {...{label, error, inputClass}}>
            <InputNumber
                {...field}
                inputClassName='text-right'
                inputRef={field.ref}
                inputId={props.id}
                {...props}
            />
        </Field>;
        case 'integer': return <Field {...{label, error, inputClass}}>
            <InputNumber
                {...field}
                inputClassName='w-full text-right'
                inputRef={field.ref}
                showButtons
                inputId={props.id}
                {...props}
            />
        </Field>;
        case 'image': return <Field {...{label, error, inputClass}}>
            <Image
                imageClassName='w-full'
                preview
                src={field.value ? (props.basePath || '') + field.value : null}
                {...(({basePath, ...rest}) => rest)(props)}
            />
        </Field>;
        case 'imageUpload': {
            const onChange = field.onChange;
            delete field.onChange;
            let src = null;
            if (Array.isArray(field.value)) {
                src = field.value?.[0]?.objectURL;
            } else if (field.value) {
                src = (props.basePath || '') + field.value;
            }
            return <Field {...{label, error, inputClass}}>

                <FileUpload
                    {...field}
                    onSelect={e => {
                        onChange?.({...e, value: [...e.files || []]});
                    }}
                    {...props}
                    accept='image/*'
                    multiple={false}
                    headerTemplate={(options) => {
                        const { className, chooseButton } = options;
                        return (
                            <div className={className}>
                                {chooseButton}
                            </div>
                        );
                    }}
                    itemTemplate={() => {
                        return (
                            <Image
                                imageClassName='w-full'
                                preview
                                src={src}
                                {...(({basePath, ...rest}) => rest)(props)}
                            />
                        );
                    }}
                    emptyTemplate={() => {
                        return src ? <Image
                            imageClassName='w-full'
                            preview
                            src={src}
                            {...(({basePath, ...rest}) => rest)(props)}
                        /> : <div>No picture...</div>;
                    }}
                />
            </Field>;
        }
        case 'password': return <Field {...{label, error, inputClass}}>
            <Password
                {...field}
                value={field.value || ''}
                onChange={e => field.onChange?.({...e, value: e.target.value || null})}
                role='textbox'
                feedback={false}
                inputClassName='w-full'
                inputId={props.id}
                {...props}
            />
        </Field>;
        case 'file': {
            const onChange = field.onChange;
            delete field.onChange;
            return <Field {...{label, error, inputClass}}>
                <FileUpload
                    {...field}
                    onSelect={e => {
                        onChange?.({...e, value: [...e.files || []]});
                    }}
                    mode='basic'
                    {...props}
                />
            </Field>;
        }
        case 'ocr': {
            const onChange = field.onChange;
            delete field.onChange;
            return <Field {...{label, error, inputClass}}>
                <Ocr
                    {...field}
                    setValue={formApi.setValue}
                    onSelect={e => {
                        onChange?.({...e, value: {file: e.files?.[0], text: e.text}});
                    }}
                    {...props}
                />
            </Field>;
        }
        case 'page': {
            return <div className='w-full'>
                <Component
                    parent={parentValue}
                    page={props.page}
                    getValues={formApi.getValues}
                    {...field}
                    {...props}
                />
            </div>;
        }
        case 'label': return (field?.name || title) ? <Field label={label} inputClass={widgetClassName}>{field?.name ? field?.value : title}</Field> : null;
        case 'icon': return (field?.name || title) ? <i className={clsx('pi', field?.name ? field?.value : title, widgetClassName)}/> : null;
        case 'gps': return <Field {...{label, error, inputClass}}>
            <GMap {...field} {...props} />
        </Field>;
        default: return <Field {...{label, error, inputClass}}>
            <InputText
                {...field}
                value={field.value || ''}
                onChange={e => field.onChange?.({...e, value: e.target.value || null})}
                {...props}
            />
            <Clear field={field} showClear={clear}/>
        </Field>;
    }
}

export default function Input({
    Label,
    ErrorLabel,
    labelClass: defaultLabelClass,
    name,
    propertyName = name.replace('$.edit.', ''),
    classes,
    api: {
        index,
        visibleProperties,
        onFieldChange,
        formApi,
        isPropertyRequired,
        methods,
        dropdowns,
        loading,
        counter,
        submit,
        value
    },
    ...widget
}) {
    const ctx = useContext(Context);
    widget.parent = widget.parent || name.match(/^\$\.edit\.[^.]+/)?.[0].replace('.edit.', '.selected.') || widget?.selectionPath;
    const parent = widget.parent || index.properties[propertyName]?.widget?.parent;
    const {
        fieldClass = null,
        labelClass = defaultLabelClass,
        onChange = onFieldChange,
        ...inputWidget
    } = {
        id: name.replace(/\./g, '-') || widget.label,
        ...index.properties[propertyName]?.widget,
        ...widget,
        parent
    };
    if (typeof inputWidget.visible === 'string' && !formApi?.watch?.(inputWidget.visible)) return null;
    if ('visible' in inputWidget && !inputWidget.visible) return null;
    if (typeof inputWidget.enabled === 'string') inputWidget.disabled = !formApi?.watch?.(inputWidget.enabled);
    if (typeof inputWidget.disabled === 'string') inputWidget.disabled = !!formApi?.watch?.(inputWidget.disabled);
    if (!inputWidget.className) {
        const inputClassName = classes?.default?.input || classes?.[name]?.input;
        if (inputClassName) inputWidget.className = inputClassName;
    }
    const render = ({field, fieldState}) => {
        const parentWatch = parent && formApi?.watch?.(parent);
        return input(
            Label && <Label name={propertyName} className={labelClass} label={widget.label} isRequired={isPropertyRequired(propertyName)}/>,
            ErrorLabel && <ErrorLabel name={propertyName} className={labelClass} />,
            {
                className: clsx({'w-full': !['boolean'].includes(inputWidget.type)}, { 'p-invalid': fieldState.error }),
                ...field,
                onChange: async(event: {value: unknown, originalEvent: unknown}, {select = false, field: changeField = true, children = true} = {}) => {
                    if (onChange && methods) {
                        try {
                            if (await methods[onChange]({
                                field,
                                value: event.value,
                                event: event.originalEvent,
                                form: formApi
                            }) === false) return;
                        } catch (error) {
                            formApi.setError(field.name, {message: error.message});
                            return;
                        }
                    }
                    if (select) {
                        const prefix = `$.edit.${propertyName}.`;
                        const selectionPrefix = widget?.selectionPath || '$.selected';
                        formApi?.setValue?.(
                            `${selectionPrefix}.${propertyName}`,
                            event?.value,
                            selectionPrefix.startsWith('$.') ? {shouldDirty: false, shouldTouch: false} : {shouldDirty: true, shouldTouch: true}
                        );
                        visibleProperties.forEach(property => {
                            if (property.startsWith(prefix)) {
                                formApi?.setValue?.(
                                    property,
                                    event?.value?.[property.substr(prefix.length)],
                                    {shouldDirty: false, shouldTouch: false}
                                );
                            }
                        });
                    }
                    try {
                        if (children) {
                            const items = index.children[propertyName];
                            if (items) {
                                items.forEach(child => {
                                    let childValue = null;
                                    const autocompleteProp = child.split('.').pop();
                                    const autocomplete = (event as {value?: Record<string, unknown>})?.value?.[autocompleteProp];
                                    if (index.properties[propertyName]?.widget?.type === 'autocomplete' && autocomplete) childValue = autocomplete;
                                    formApi?.setValue?.(child, childValue);
                                });
                            }
                        }
                    } finally {
                        if (changeField) {
                            field.onChange(event.value);
                            if (parentWatch?.[CHANGE] && name.startsWith('$.edit.')) {
                                const old = {...parentWatch};
                                parentWatch[name.split('.').pop()] = event?.value;
                                parentWatch[CHANGE]({data: old, newData: parentWatch});
                            }
                        }
                    }
                }
            },
            getFieldClass(index, classes, propertyName, fieldClass),
            inputWidget.className,
            inputWidget,
            index.properties[propertyName],
            dropdowns,
            parentWatch,
            loading,
            formApi,
            counter,
            methods,
            submit,
            !formApi?.getValues && 'label',
            ctx
        );
    };
    return (name && formApi?.control) ? <Controller
        control={formApi.control}
        name={name}
        render={render}
    /> : render({field: value ? {value: get(value, name.split('.').pop()), name} : {}, fieldState: {}});
}
