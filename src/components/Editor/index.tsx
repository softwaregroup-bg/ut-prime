import clsx from 'clsx';
import Joi from 'joi';
import lodashGet from 'lodash.get';
import lodashSet from 'lodash.set';
import React from 'react';
import merge from 'ut-function.merge';

import { joiResolver } from '@hookform/resolvers/joi';
import type { UseFormReturn } from 'react-hook-form';

import Form from '../Form';
import getValidation from '../Form/schema';
import ScrollBox from '../ScrollBox';
import useCustomization from '../hooks/useCustomization';
import useLoad from '../hooks/useLoad';
import fieldNames from '../lib/fields';
import prepareSubmit from '../lib/prepareSubmit';
import testid from '../lib/testid';
import { Button, ConfirmPopup, Toolbar, confirmPopup } from '../prime';
import type {Schema} from '../types';
import { ComponentProps } from './Editor.types';

const backgroundNone = {background: 'none'};

function handleArray(result, properties) {
    Object.entries(result).forEach(([name, value]) => {
        // back end wrongly returned an array with a single item
        if (Array.isArray(value) && properties[name]?.properties) result[name] = value[0];
    });
    return result;
}

const empty = {title: undefined};

function getDefault(schema: Schema) {
    if (schema.default) return schema.default;
    else if (schema.properties) {
        return Object.entries(schema.properties).reduce(
            (map, [name, property]) => {
                const value = getDefault(property);
                return value === undefined ? map : {...map, [name]: value};
            },
            undefined
        );
    }
}

const Editor: ComponentProps = ({
    object,
    id,
    value: initValue,
    schema: schemaEdit = {},
    schemaCreate,
    editors,
    debug,
    noScroll,
    hidden,
    typeField,
    cards,
    layouts,
    layoutName,
    name,
    customization,
    onCustomization,
    keyField = object + 'Id',
    resultSet = object,
    design: designDefault,
    loading: loadingValue = 'loading',
    methods,
    onDropdown,
    onInit,
    onAdd,
    onGet,
    onEdit,
    onChange,
    onFieldChange,
    toolbar = !!(onAdd || onEdit || onGet)
}) => {
    const [keyValue, setKeyValue] = React.useState(id);
    const schema = (schemaCreate && keyValue == null) ? schemaCreate : schemaEdit;

    const [trigger, setTrigger] = React.useState();
    const [validate, setValidate] = React.useState<(selectedList: object) => object>();
    const [formApi, setFormApi] = React.useState<UseFormReturn>();
    const [didSubmit, setDidSubmit] = React.useState(false);
    const [value, setEditValue] = React.useState({});
    const [loadedValue, setLoadedValue] = React.useState<object>();
    const [dropdowns, setDropdown] = React.useState({});
    const [[mode, layoutState], setMode] = React.useState([id == null ? 'create' : 'edit' as 'create' | 'edit', layoutName]);
    const [loading, setLoading] = React.useState(loadingValue);
    const [customizationToolbar, mergedSchema, mergedCards, inspector, loadCustomization, items, orientation, thumbIndex, layout, formProps] =
        useCustomization(designDefault, schema, cards, layouts, customization, mode, layoutState, Editor, undefined, onCustomization, methods, name, loading, trigger, validate, formApi);
    name = name ? name + '.' : '';
    const {properties = empty} = mergedSchema;

    const layoutItems = items ? false : layout; // preserve memoization
    const [validation, dropdownNames, getValue, layoutFields] = React.useMemo(() => {
        const indexCards = items && items.map(item => [item.widgets, item?.items?.map(item => item.widgets)]).flat(2).filter(Boolean);
        const {fields, validation, dropdownNames} = fieldNames(indexCards || layoutItems || [], mergedCards, mergedSchema, editors);
        const getValue = (value) => {
            const editValue = {};
            fields.forEach(field => {
                const fieldValue = lodashGet(value, field);
                if (fieldValue !== undefined) lodashSet(editValue, field, fieldValue);
            });
            return editValue;
        };
        return [validation, dropdownNames, getValue, fields];
    }, [mergedCards, editors, items, layoutItems, mergedSchema]);

    const [validationSchema, requiredProperties] = React.useMemo<[Joi.Schema, string[]]>(() => getValidation(schema), [schema]);
    const resolver = React.useMemo(
        () => joiResolver(validation || validationSchema, {stripUnknown: true, abortEarly: false}),
        [validation, validationSchema]
    );
    const isPropertyRequired = React.useCallback((propertyName) => requiredProperties.includes(propertyName), [requiredProperties]);

    React.useEffect(() => {
        const validator = (selectedList) => {
            // in the future here might be used validationSchema.validate with respect to the layout properties
            if (!formApi || typeof selectedList?.validation?.validate !== 'function') return;
            const result = selectedList?.validation?.validate((({$original, ...values}) => values)(formApi.getValues()));
            return result;
        };
        setValidate(() => validator);
    }, [formApi]);

    async function get() {
        setLoading(loadingValue);
        const [result] = await Promise.all([
            onGet({[keyField]: keyValue}),
            loadCustomization()
        ]);
        handleArray(result, properties);
        if (typeField) setMode(['edit', lodashGet(result, typeField)]);
        setLoadedValue(result);
        setLoading('');
    }
    async function init() {
        setLoading(loadingValue);
        await loadCustomization();
        setLoading('');
    }

    React.useEffect(() => {
        async function edit() {
            const value = merge(getDefault(mergedSchema), initValue, onInit && await onInit(initValue));
            if (value !== undefined) setEditValue(getValue(value));
        }
        edit();
    }, [getValue, initValue, mergedSchema, onInit]);

    React.useEffect(() => {
        const loadDropDown = async() => setDropdown(await onDropdown(dropdownNames));
        loadDropDown();
    }, [dropdownNames, onDropdown]);

    const toolbarRef = React.useRef(null);

    React.useEffect(() => {
        if (loadedValue !== undefined) setEditValue(getValue(loadedValue));
    }, [loadedValue, getValue, setEditValue]);

    const handleSubmit = React.useCallback(
        async function handleSubmit(data) {
            let response;
            let key = keyValue;
            if (data?.[2].method) {
                response = getValue(handleArray(await methods[data[2].method](prepareSubmit(data)), properties));
            } else if (keyValue != null) {
                response = getValue(handleArray(await onEdit(prepareSubmit(data)), properties));
            } else {
                response = getValue(handleArray(await onAdd(prepareSubmit(data)), properties));
                key = lodashGet(response, `${resultSet}.${keyField}`);
                setKeyValue(key);
            }
            setDidSubmit(true);
            const value = merge({}, data[0], response);
            setEditValue(value);
            if (key) setLoadedValue(getValue(value));
            setMode(prev => ['edit', typeField ? lodashGet(value, typeField) : prev[1]]);
        }, [keyValue, onEdit, getValue, onAdd, keyField, resultSet, properties, typeField, methods]
    );

    const handleReset = React.useCallback(
        async function handleReset(event) {
            const accept = () => {
                const value = loadedValue ? getValue(loadedValue) : {[resultSet]: null};
                setEditValue(value);
                setMode(prev => ['edit', typeField ? lodashGet(value, typeField) : prev[1]]);
                setDidSubmit(false);
            };
            if (!trigger) return accept();
            return confirmPopup({
                target: event.currentTarget,
                message: 'Changed data will not be saved. Are you sure you want to proceed?',
                icon: 'pi pi-exclamation-triangle',
                reject: () => {},
                accept
            });
        }, [trigger, typeField, loadedValue, resultSet, getValue]
    );

    useLoad(async() => {
        if (keyValue) await get();
        else await init();
    });

    return (
        <>
            <ConfirmPopup />
            {toolbar ? <Toolbar
                className='border-none border-bottom-1 border-50 p-2'
                style={backgroundNone}
                left={<>
                    <Button
                        icon='pi pi-save'
                        onClick={trigger}
                        disabled={!trigger || !!loading}
                        aria-label='save'
                        className='mr-2'
                        {...testid(name + 'saveButton')}
                    />
                    <Button
                        icon='pi pi-replay'
                        onClick={handleReset}
                        disabled={(!trigger && (!didSubmit || !!loadedValue)) || !!loading}
                        aria-label='reset'
                        className='mr-2'
                        {...testid(name + 'resetButton')}
                    />
                    <div ref={toolbarRef}></div>
                </>}
                right={customizationToolbar}
            /> : null}
            <div className={clsx('flex', 'overflow-x-hidden', 'w-full', orientation === 'top' && 'flex-column')}>
                {thumbIndex}
                <ScrollBox className='flex flex-grow-1' noScroll={noScroll || hidden}>
                    <Form
                        schema={mergedSchema}
                        debug={debug}
                        editors={editors}
                        cards={mergedCards}
                        layout={layout || []}
                        onSubmit={handleSubmit}
                        onChange={onChange}
                        onFieldChange={onFieldChange}
                        methods={methods}
                        value={value}
                        dropdowns={dropdowns}
                        loading={loading}
                        setTrigger={setTrigger}
                        validation={validation}
                        toolbarRef={toolbarRef}
                        layoutFields={layoutFields}
                        setFormApi={setFormApi}
                        resolver={resolver}
                        isPropertyRequired={isPropertyRequired}
                        {...formProps}
                    />
                    {inspector}
                </ScrollBox>
            </div>
        </>
    );
};

export default Editor;
