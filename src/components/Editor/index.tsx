import React from 'react';
import lodashGet from 'lodash.get';
import lodashSet from 'lodash.set';
import merge from 'ut-function.merge';
import clsx from 'clsx';

import { ComponentProps } from './Editor.types';

import Form from '../Form';
import {Toolbar, Button, ConfirmPopup, confirmPopup} from '../prime';
import useLoad from '../hooks/useLoad';
import prepareSubmit from '../lib/prepareSubmit';
import testid from '../lib/testid';
import fieldNames from '../lib/fields';
import type {Schema} from '../types';
import useCustomization from '../hooks/useCustomization';
import useScroll from '../hooks/useScroll';

const backgroundNone = {background: 'none'};

function handleArray(result: object, properties) {
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
    init: initValue,
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
    toolbar = !!(onAdd || onEdit || onGet)
}) => {
    const [keyValue, setKeyValue] = React.useState(id);
    const schema = (schemaCreate && keyValue == null) ? schemaCreate : schemaEdit;
    name = name ? name + '.' : '';

    const [trigger, setTrigger] = React.useState();
    const [didSubmit, setDidSubmit] = React.useState(false);
    const [value, setEditValue] = React.useState({});
    const [loadedValue, setLoadedValue] = React.useState<object>();
    const [dropdowns, setDropdown] = React.useState({});
    const [[mode, layoutState], setMode] = React.useState([id == null ? 'create' : 'edit' as 'create' | 'edit', layoutName]);
    const [loading, setLoading] = React.useState(loadingValue);
    const [formWrapRef, maxHeight] = useScroll(noScroll, false, [hidden]);
    const [customizationToolbar, mergedSchema, mergedCards, inspector, loadCustomization, items, orientation, thumbIndex, layout, formProps] =
        useCustomization(designDefault, schema, cards, layouts, customization, mode, layoutState, Editor, maxHeight, onCustomization, methods, name, loading);
    const {properties = empty} = mergedSchema;

    const [validation, dropdownNames, getValue] = React.useMemo(() => {
        const indexCards = items && items.map(item => [item.widgets, item?.items?.map(item => item.widgets)]).flat(2).filter(Boolean);
        const {fields, validation, dropdownNames} = fieldNames(indexCards || layout || [], mergedCards, mergedSchema, editors);
        const getValue = (value) => {
            const editValue = {};
            fields.forEach(field => {
                const fieldValue = lodashGet(value, field);
                if (fieldValue !== undefined) lodashSet(editValue, field, fieldValue);
            });
            return editValue;
        };
        return [validation, dropdownNames, getValue];
    }, [mergedCards, editors, items, layout, mergedSchema]);

    async function get() {
        setLoading(loadingValue);
        const [result, dropdownResult] = await Promise.all([
            onGet({[keyField]: keyValue}),
            onDropdown(dropdownNames),
            loadCustomization()
        ]);
        handleArray(result, properties);
        if (typeField) setMode(['edit', lodashGet(result, typeField)]);
        setDropdown(dropdownResult);
        setLoadedValue(result);
        setLoading('');
    }
    async function init() {
        setLoading(loadingValue);
        const [dropdownResult] = await Promise.all([
            onDropdown(dropdownNames),
            loadCustomization()
        ]);
        setDropdown(dropdownResult);
        initValue = merge(getDefault(mergedSchema), initValue, onInit && await onInit(initValue));
        if (initValue !== undefined) setEditValue(getValue(initValue));
        setLoading('');
    }

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
            setMode(['edit', layoutName || (typeField ? lodashGet(value, typeField) : '')]);
        }, [keyValue, onEdit, getValue, onAdd, keyField, resultSet, properties, typeField, layoutName, methods]
    );

    const handleReset = React.useCallback(
        async function handleReset(event) {
            const accept = () => {
                const value = loadedValue ? getValue(loadedValue) : {[resultSet]: null};
                setEditValue(value);
                setMode(['edit', layoutName || (typeField ? lodashGet(value, typeField) : '')]);
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
        }, [trigger, layoutName, typeField, loadedValue, resultSet, getValue]
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
                <div ref={formWrapRef} className='flex flex-grow-1'>
                    <div className='flex flex-grow-1 overflow-y-auto overflow-x-hidden' style={maxHeight}>
                        <Form
                            schema={mergedSchema}
                            debug={debug}
                            editors={editors}
                            cards={mergedCards}
                            layout={layout || []}
                            onSubmit={handleSubmit}
                            onChange={onChange}
                            methods={methods}
                            value={value}
                            dropdowns={dropdowns}
                            loading={loading}
                            setTrigger={setTrigger}
                            validation={validation}
                            toolbarRef={toolbarRef}
                            {...formProps}
                        />
                    </div>
                    {inspector}
                </div>
            </div>
        </>
    );
};

export default Editor;
