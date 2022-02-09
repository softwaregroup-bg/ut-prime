import React from 'react';
import {
    InputText,
    Password,
    InputTextarea,
    DropdownTest,
    MultiSelectTest,
    TreeSelectTest,
    TreeTableTest,
    InputMask,
    InputNumber,
    Calendar,
    CheckboxTest,
    Image,
    Skeleton,
    SelectButtonTest,
    FileUpload,
    Column
} from '../prime';
import { RefCallBack } from 'react-hook-form';

import getType from '../lib/getType';
import Table from './inputs/Table';
import MultiSelectPanel from './inputs/MultiSelectPanel';
const noActions = {allowAdd: false, allowEdit: false, allowDelete: false};

const Field = ({children, label, error, inputClass}) => <>
    {label}
    <div className={inputClass}>{children}</div>
    {error}
</>;

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
        type,
        dropdown = '',
        parent: parentField = '',
        optionsFilter = null,
        title = '',
        ...props
    }: any = {id: field?.name},
    schema,
    dropdowns,
    parentValue,
    loading: string,
    getValues: (name: any) => any,
    counter
) {
    if (loading) return <>{label}<div className={inputClass}><Skeleton className='p-inputtext'/></div></>;
    props.disabled = schema?.readOnly || (parentField && !parentValue);
    const filterBy = item => (!parentField && !optionsFilter) || Object.entries({...optionsFilter, parent: parentValue}).every(([name, value]) => String(item[name]) === String(value));
    switch (type || schema?.format || getType(schema?.type)) {
        case 'dropdownTree': return <Field {...{label, error, inputClass}}>
            <TreeSelectTest
                {...field}
                value={field.value == null ? field.value : String(field.value)}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                inputId={field.name}
                {...props}
            />
        </Field>;
        case 'text': return <Field {...{label, error, inputClass}}>
            <InputTextarea
                {...field}
                value={field.value || ''}
                {...props}
            />
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
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.value)}
                minFractionDigits={2}
                maxFractionDigits={4}
                inputId={field.name}
                {...props}
            />
        </Field>;
        case 'boolean': return <Field {...{label, error, inputClass}}>
            <CheckboxTest
                {...field}
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.checked)}
                checked={field.value}
                id={field.name}
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
                    parent={parentValue}
                    properties={schema?.items?.properties}
                    dropdowns={dropdowns}
                    getValues={getValues}
                    counter={counter}
                    {...props}
                />
            </div>
        </>;
        case 'dropdown': return <Field {...{label, error, inputClass}}>
            <DropdownTest
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                {...props}
            />
        </Field>;
        case 'multiSelect': return <Field {...{label, error, inputClass}}>
            <MultiSelectTest
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                display='chip'
                {...props}
            />
        </Field>;
        case 'select': return <Field {...{label, error, inputClass}}>
            <SelectButtonTest
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
                value={props?.split ? field.value?.split(props.split).filter(Boolean) : field.value}
                onChange={event => field.onChange(props?.split ? event.value.join(props.split) || null : event.value)}
                {...props}
            />
        </Field>;
        case 'multiSelectTree': return <Field {...{label, error, inputClass}}>
            <TreeSelectTest
                {...field}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
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
        case 'multiSelectPanel': return <Field {...{label, error, inputClass}}>
            <MultiSelectPanel
                appendTo='self'
                {...field}
                value={props?.split ? field.value?.split(props.split).filter(Boolean) : field.value}
                onChange={event => field.onChange(props?.split ? event.value.join(props.split) || null : event.value)}
                options={dropdowns?.[dropdown]?.filter(filterBy) || []}
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
                            field.onChange?.(
                                event.filter(e => selection.findIndex(s => s[dataKey] === e[dataKey]) > -1),
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
                <TreeTableTest
                    {...field}
                    value={dropdowns?.[dropdown]?.filter(filterBy) || []}
                    selectionKeys={field.value}
                    onSelectionChange={e => field.onChange?.(e.value)}
                    selectionMode='checkbox'
                    {...props}
                >
                    <Column field='label' expander/>
                </TreeTableTest>
            </div>
        </>;
        case 'date-time': return <Field {...{label, error, inputClass}}>
            <Calendar
                {...field}
                showTime
                showIcon
                value={field.value != null ? new Date(field.value) : field.value}
                inputId={field.name}
                {...props}
            />
        </Field>;
        case 'time': return <Field {...{label, error, inputClass}}>
            <Calendar
                {...field}
                timeOnly
                showIcon
                value={field.value != null ? new Date(field.value) : field.value}
                inputId={field.name}
                {...props}
            />
        </Field>;
        case 'date': return <Field {...{label, error, inputClass}}>
            <Calendar
                {...field}
                showIcon
                value={field.value != null ? new Date(field.value) : field.value}
                inputId={field.name}
                {...props}
            />
        </Field>;
        case 'number': return <Field {...{label, error, inputClass}}>
            <InputNumber
                {...field}
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.value)}
                inputId={field.name}
                {...props}
            />
        </Field>;
        case 'integer': return <Field {...{label, error, inputClass}}>
            <InputNumber
                {...field}
                inputClassName='w-full'
                inputRef={field.ref}
                onChange={e => field.onChange?.(e.value)}
                showButtons
                inputId={field.name}
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
                inputId={field.name}
                {...props}
            />
        </Field>;
        case 'file': return <Field {...{label, error, inputClass}}>
            <FileUpload
                {...field}
                value={field.value}
                onSelect={e => {
                    field.onChange?.(e.files || null);
                }}
                mode='basic'
                {...props}
            />
        </Field>;
        default: return <Field {...{label, error, inputClass}}>
            <InputText
                {...field}
                value={field.value || ''}
                onChange={e => field.onChange?.(e.target.value || null)}
                {...props}
            />
        </Field>;
    }
}
