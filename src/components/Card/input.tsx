import React from 'react';
import clsx from 'clsx';
import { RefCallBack } from 'react-hook-form';

import {
    AutoComplete,
    Button,
    Calendar,
    Checkbox,
    Chips,
    Column,
    Dropdown,
    FileUpload,
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
import {PropertyEditor} from '../types';

import getType from '../lib/getType';
import testid from '../lib/testid';
import Table from './inputs/Table';
import Ocr from './inputs/Ocr';
import ActionButton from '../ActionButton';
import SubmitButton from '../SubmitButton';

const noActions = {allowAdd: false, allowEdit: false, allowDelete: false};

const Field = ({children = undefined, label = undefined, error = undefined, inputClass = undefined}) => <>
    {label}
    <div className={inputClass}>{children}</div>
    {error}
</>;

const Clear = ({showClear, field}) =>
    (showClear && field.value !== undefined)
        ? <div className='absolute flex right-0 top-0 bottom-0 justify-content-center align-items-center m-2' style={{width: '2.375rem'}}>
            <i onClick={e => field.onChange(undefined)} className={`pi cursor-pointer ${showClear === true ? 'pi-times' : showClear}`}></i>
        </div>
        : null;

export default function input(
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
    getValues: (name: string) => unknown,
    setValue: (name: string, value: unknown) => void,
    counter,
    methods,
    submit,
    defaultWidgetType
) {
    const widgetType = type || defaultWidgetType || schema?.format || getType(schema?.type);
    if (loading) {
        if (['button', 'submit'].includes(widgetType)) return <Button className={inputClass ?? 'mr-2'} {...props} disabled>{label}</Button>;
        return <>{label}<div className={inputClass}><Skeleton className='p-inputtext'/></div></>;
    }
    props.disabled ??= schema?.readOnly || (parentField && !parentValue);
    const filterBy = item => (!parentField && !optionsFilter) || Object.entries({...optionsFilter, parent: parentValue}).every(([name, value]) => String(item[name]) === String(value));
    switch (widgetType) {
        case 'button': return <ActionButton
            className={inputClass ?? 'mr-2'}
            label={label}
            action=''
            {...props}
            getValues={getValues as Parameters<typeof ActionButton>[0]['getValues']}
        />;
        case 'submit': return <SubmitButton
            className={inputClass ?? 'mr-2'}
            label={label}
            method=''
            {...props}
            submit={submit}
        />;
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
                onChange={e => field.onChange?.(e.value.join(' '))}
                {...props}
            />
            <Clear field={field} showClear={clear}/>
        </Field>;
        case 'text': return <Field {...{label, error, inputClass}}>
            <InputTextarea
                {...field}
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
        case 'currency': return <Field {...{label, error, inputClass}}>
            <InputNumber
                {...field}
                inputClassName='text-right'
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.value)}
                minFractionDigits={2}
                maxFractionDigits={4}
                inputId={props.id}
                {...props}
            />
        </Field>;
        case 'boolean': return <Field {...{label, error, inputClass}}>
            <Checkbox
                {...field}
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.checked)}
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
                        selectionMode='checkbox'
                        parent={parentValue}
                        properties={schema?.items?.properties}
                        dropdowns={dropdowns}
                        getValues={getValues}
                        counter={counter}
                        {...props.selectionPath && getValues && {selection: getValues(`${props.selectionPath}.${field.name}`) || []}}
                        {...props}
                    />
                </div>
            </div>
        </>;
        case 'autocomplete': {
            const {autocomplete} = schema.widget;
            const handleComplete = async({query}) => (
                autocomplete && field.onChange?.({...field.value, value: query, ...await methods?.[autocomplete]({query})})
            );
            const handleChange = ({value}) => field.onChange?.({value});
            const handleSelect = ({value}) => field.onChange?.(value);
            const handleClear = () => field.onChange?.({});
            const template = ({value}) => value;
            return <Field {...{label, error, inputClass}}>
                <AutoComplete
                    {...field}
                    {...testid(props.id)}
                    inputClassName='w-full'
                    suggestions={field.value?.suggestions}
                    value={field.value?.value}
                    completeMethod={handleComplete}
                    onSelect={handleSelect}
                    onChange={handleChange}
                    onClear={handleClear}
                    itemTemplate={template}
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
                onChange={event => field.onChange?.(props?.split ? event.value.join(props.split) || null : event.value)}
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
                    field.onChange?.(Object.keys(e.value));
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
                onChange={event => field.onChange?.(props?.split ? event.value.join(props.split) || null : event.value)}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                {...testid(props.id)}
                inline
                flex
                itemClassName='col-3'
                {...columns && {itemClassName: [undefined, 'w-12', 'w-6', 'w-4', 'w-3', undefined, 'w-2'][columns]}}
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
                        properties={schema?.widget?.items?.properties}
                        selection={selection}
                        onSelectionChange={event => {
                            if (props.disabled) return;
                            if (!paramSet) {
                                return field.onChange?.(
                                    single
                                        ? event.value[dataKey]
                                        : [].concat(hidden, event.value?.map(row => row?.[dataKey])),
                                    {children: false, ...props.change}
                                );
                            }
                            if (!value?.length) {
                                return field.onChange?.(
                                    [].concat(
                                        hidden,
                                        event.value
                                    ),
                                    {children: false, ...props.change}
                                );
                            }
                            for (const key of props.widgets) {
                                const setWidgetIndex = value.findIndex(e => e[key]);
                                if (setWidgetIndex > -1 && !event.value.find(e => e[key])) {
                                    delete value[setWidgetIndex][key];
                                }
                            }
                            return field.onChange?.(
                                [].concat(
                                    hidden,
                                    value?.filter?.(fv => event.value?.findIndex?.(v => fv[dataKey] === v[dataKey]) > -1),
                                    event.value.filter?.(v => value?.findIndex?.(fv => fv[dataKey] === v[dataKey]) < 0)
                                ).filter(Boolean),
                                {children: false, ...props.change}
                            );
                        }}
                        onChange={event =>
                            !props.disabled && field.onChange?.(
                                event.filter(e => selection.findIndex(s => s[dataKey] === e[dataKey]) > -1),
                                {children: false, ...props.change}
                            )
                        }
                        {...props}
                        className={clsx(field.className || props.className, props.disabled && 'p-disabled')}
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
                    onChange={undefined}
                    onSelectionChange={e => field.onChange?.(e.value)}
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
                value={field.value != null ? new Date(field.value) : field.value}
                inputId={props.id}
                {...props}
            />
        </Field>;
        case 'number': return <Field {...{label, error, inputClass}}>
            <InputNumber
                {...field}
                inputClassName='text-right'
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.value)}
                inputId={props.id}
                {...props}
            />
        </Field>;
        case 'integer': return <Field {...{label, error, inputClass}}>
            <InputNumber
                {...field}
                inputClassName='w-full text-right'
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.value)}
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
        case 'password': return <Field {...{label, error, inputClass}}>
            <Password
                {...field}
                value={field.value || ''}
                onChange={e => field.onChange?.(e.target.value || null)}
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
                        onChange?.([...e.files || []]);
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
                    setValue={setValue}
                    onSelect={e => {
                        onChange?.([...e.files || []]);
                    }}
                    {...props}
                />
            </Field>;
        }
        case 'label': return (field?.name || title) ? <Field inputClass={widgetClassName}>{field?.value ?? title}</Field> : null;
        case 'icon': return (field?.name || title) ? <i className={clsx('pi', field?.value ?? title, widgetClassName)}/> : null;
        default: return <Field {...{label, error, inputClass}}>
            <InputText
                {...field}
                value={field.value || ''}
                onChange={e => field.onChange?.(e.target.value || null)}
                {...props}
            />
            <Clear field={field} showClear={clear}/>
        </Field>;
    }
}
