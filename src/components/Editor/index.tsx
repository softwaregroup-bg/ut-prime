import clsx from 'clsx';
import lodashGet from 'lodash.get';
import React from 'react';
import merge from 'ut-function.merge';

import Form from '../Form';
import ScrollBox from '../ScrollBox';
import useCustomization from '../hooks/useCustomization';
import useLoad from '../hooks/useLoad';
import prepareSubmit from '../lib/prepareSubmit';
import testid from '../lib/testid';
import { Toolbar } from '../prime';
import ActionButton from '../ActionButton';
import type {Schema} from '../types';
import { ComponentProps } from './Editor.types';
import useSubmit from '../hooks/useSubmit';

const backgroundNone = {background: 'none'};

function handleArray(result, properties) {
    if (!result) return result;
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
    buttons: {
        save,
        reset
    } = {},
    toolbar = !!(onAdd || onEdit || onGet)
}) => {
    const [keyValue, setKeyValue] = React.useState(id);
    const schema = (schemaCreate && keyValue == null) ? schemaCreate : schemaEdit;

    const [trigger, setTrigger] = React.useState();
    const [didSubmit, setDidSubmit] = React.useState(false);
    const [dropdowns, setDropdown] = React.useState({});
    const [[value, mode, layoutState, loadedValue], setValueMode] = React.useState([{}, id == null ? 'create' : 'edit' as 'create' | 'edit', layoutName, undefined]);
    const [loading, setLoading] = React.useState(loadingValue);
    const {
        customizationToolbar,
        mergedSchema,
        mergedCards,
        inspector,
        loadCustomization,
        orientation,
        thumbIndex,
        layout,
        disabled,
        enabled,
        formProps,
        dropdownNames,
        getLayoutValue,
        layoutFields,
        formApi,
        isPropertyRequired
    } = useCustomization({
        designDefault,
        schema,
        cards,
        layouts,
        customization,
        mode,
        layoutState,
        Editor,
        onCustomization,
        methods,
        name,
        loading,
        trigger,
        editors
    });
    name = name ? name + '.' : '';
    const {properties = empty} = mergedSchema;

    async function get() {
        setLoading(loadingValue);
        const [result] = await Promise.all([
            onGet({[keyField]: keyValue}),
            loadCustomization()
        ]);
        handleArray(result, properties);
        setValueMode(prev => [prev[0], 'edit', typeField ? lodashGet(result, typeField) : prev[2], result]);
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
            if (value !== undefined) setValueMode(prev => [getLayoutValue(prev[1], prev[2], value), prev[1], prev[2], prev[3]]);
        }
        edit();
    }, [initValue]); // eslint-disable-line react-hooks/exhaustive-deps

    const {handleSubmit: loadDropDown} = useSubmit(async() => setDropdown(await onDropdown(dropdownNames)), [dropdownNames, onDropdown]);

    React.useEffect(() => {
        loadDropDown();
    }, [loadDropDown]);

    const toolbarRef = React.useRef(null);

    React.useEffect(() => {
        if (loadedValue !== undefined) setValueMode(prev => [getLayoutValue(prev[1], prev[2], loadedValue), prev[1], prev[2], prev[3]]);
    }, [loadedValue, getLayoutValue, setValueMode]);

    const handleSubmit = React.useCallback(
        async function handleSubmit(data) {
            let response;
            let key = keyValue;
            setLoading('submit');
            try {
                if (data?.[2].method) {
                    response = handleArray(await methods[data[2].method](prepareSubmit(data)), properties);
                } else if (keyValue != null) {
                    response = handleArray(await onEdit(prepareSubmit(data)), properties);
                } else {
                    response = handleArray(await onAdd(prepareSubmit(data)), properties);
                    key = lodashGet(response, `${resultSet}.${keyField}`);
                    setKeyValue(key);
                }
                setDidSubmit(true);
                setValueMode(prev => {
                    const merged = merge({...prev[0]}, data[0], response);
                    const newLayout = typeField ? lodashGet(merged, typeField) : prev[2];
                    const value = getLayoutValue('edit', newLayout, merged);
                    return [value, 'edit', newLayout, key == null ? prev[3] : value];
                });
            } finally {
                setLoading('');
            }
        }, [keyValue, onEdit, getLayoutValue, onAdd, keyField, resultSet, properties, typeField, methods, setLoading]
    );

    const handleReset = React.useCallback(function handleReset() {
        setValueMode(prev => {
            const newLayout = typeField ? lodashGet(loadedValue, typeField) : prev[2];
            return [(loadedValue ? getLayoutValue(prev[1], newLayout, loadedValue) : {[resultSet]: null}), prev[1], newLayout, prev[3]];
        });
        setDidSubmit(false);
    }, [typeField, loadedValue, resultSet, getLayoutValue]);

    useLoad(async() => {
        if (keyValue) await get();
        else await init();
    });

    return (
        <>
            {toolbar ? <Toolbar
                className='border-none border-bottom-1 border-50 p-2'
                style={backgroundNone}
                left={<>
                    {save === false ? null : <ActionButton
                        icon={loading === 'submit' ? 'pi pi-spin pi-spinner' : (didSubmit && !trigger) ? 'pi pi-check' : 'pi pi-save'}
                        onClick={trigger}
                        disabled={!trigger || !!loading}
                        aria-label='save'
                        className='mr-2'
                        {...testid(name + 'saveButton')}
                        {...save}
                    />}
                    {reset === false ? null : <ActionButton
                        icon='pi pi-replay'
                        onClick={handleReset}
                        confirm={trigger ? 'Changed data will not be saved. Are you sure you want to proceed?' : ''}
                        disabled={(!trigger && (!didSubmit || !!loadedValue)) || !!loading}
                        aria-label='reset'
                        className='mr-2'
                        {...testid(name + 'resetButton')}
                        {...reset}
                    />}
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
                        disabled={disabled}
                        enabled={enabled}
                        setTrigger={setTrigger}
                        toolbarRef={toolbarRef}
                        layoutFields={layoutFields}
                        formApi={formApi}
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
