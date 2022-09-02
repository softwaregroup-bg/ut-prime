import React from 'react';
import lodashGet from 'lodash.get';
import lodashSet from 'lodash.set';
import merge from 'ut-function.merge';
import clsx from 'clsx';

import { ComponentProps } from './Editor.types';
import SelectField from './SelectField';
import SelectCard from './SelectCard';
import Context from '../Context';
import Permission from '../Permission';

import Form from '../Form';
import getValidation from '../Form/schema';
import ThumbIndex from '../ThumbIndex';
import Inspector from '../Inspector';
import {Toolbar, Button, ConfirmPopup, confirmPopup} from '../prime';
import useToggle from '../hooks/useToggle';
import useLoad from '../hooks/useLoad';
import {ConfigField, ConfigCard} from '../Form/DragDrop';
import prepareSubmit from '../lib/prepareSubmit';
import testid from '../lib/testid';
import type {Cards, Layouts, Schema} from '../types';

const backgroundNone = {background: 'none'};

const capital = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

function handleArray(result: object, properties) {
    Object.entries(result).forEach(([name, value]) => {
        // back end wrongly returned an array with a single item
        if (Array.isArray(value) && properties[name]?.properties) result[name] = value[0];
    });
    return result;
}

const empty = {title: undefined};

function getLayout(cards: Cards, layouts: Layouts, mode: 'create' | 'edit', name = '') {
    let layoutName = mode + capital(name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items: any = layouts?.[layoutName];
    if (!items && mode !== 'edit' && !cards[layoutName]) {
        layoutName = 'edit' + capital(name);
        items = layouts?.[layoutName];
    }
    let layout: string[];
    const orientation = items?.orientation;
    if (orientation) items = items.items;
    if (typeof (items?.[0]?.[0] || items?.[0]) === 'string') {
        layout = items;
        items = false;
    } else layout = !items && [layoutName];
    let toolbar = `toolbar${capital(mode)}${capital(name)}`;
    if (!cards[toolbar]) toolbar = `toolbar${capital(name)}`;
    if (!cards[toolbar]) toolbar = `toolbar${capital(mode)}`;
    if (!cards[toolbar]) toolbar = 'toolbar';
    return [items, layout, orientation || 'left', toolbar, layoutName];
}

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
    type,
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
    methods,
    onDropdown,
    onInit,
    onAdd,
    onGet,
    onEdit,
    onChange,
    toolbar = !!(onAdd || onEdit || onGet)
}) => {
    const {customization: customizationEnabled} = React.useContext(Context);
    const [keyValue, setKeyValue] = React.useState(id);
    const activeSchema = (schemaCreate && keyValue == null) ? schemaCreate : schemaEdit;
    const [mergedCustomization, setCustomization] = React.useState({schema: {}, card: {}, layout: {}, ...customization});
    const [inspected, setInspected] = React.useState(null);
    const mergedSchema = React.useMemo(() => merge({}, activeSchema, mergedCustomization.schema), [activeSchema, mergedCustomization.schema]);
    const mergedCards = React.useMemo(() => merge({}, cards, mergedCustomization.card), [cards, mergedCustomization.card]);
    const mergedLayouts = React.useMemo(() => merge({}, layouts, mergedCustomization.layout), [layouts, mergedCustomization.layout]);
    const {properties = empty} = mergedSchema;
    name = name ? name + '.' : '';

    const [trigger, setTrigger] = React.useState();
    const [didSubmit, setDidSubmit] = React.useState(false);
    const [value, setEditValue] = React.useState({});
    const [loadedValue, setLoadedValue] = React.useState<object>();
    const [dropdowns, setDropdown] = React.useState({});
    const [[mode, layoutState], setMode] = React.useState([id == null ? 'create' : 'edit' as 'create' | 'edit', layoutName]);
    const [items, layout, orientation, toolbarName, currentLayoutName] = React.useMemo(
        () => getLayout(mergedCards, mergedLayouts, mode, layoutState),
        [mergedCards, mergedLayouts, mode, layoutState]
    );
    const [filter, setFilter] = React.useState(items?.[0]?.items?.[0] || items?.[0]);
    const [loading, setLoading] = React.useState('loading');
    const [validation, dropdownNames, getValue] = React.useMemo(() => {
        const columns = (propertyName, property) => []
            .concat(property?.hidden)
            .concat(property?.widgets)
            .filter(Boolean)
            .map(name => propertyName + '.' + name)
            .concat(propertyName);
        const widgetName = widget =>
            typeof widget === 'string'
                ? columns(widget, lodashGet(mergedSchema?.properties, widget?.replace(/\./g, '.properties.'))?.widget)
                : columns(widget.name, widget);
        const indexCards = items && items.map(item => [item.widgets, item?.items?.map(item => item.widgets)]).flat(2).filter(Boolean);
        const fields: string[] = Array.from(
            new Set(
                // collect all widgets from cards
                (indexCards || layout || filter?.widgets || [])
                    .flat()
                    .map(card => mergedCards?.[card]?.widgets)
                    .flat()
                    .filter(Boolean)
                // collect all column and field names
                    .map(widgetName)
                    .flat()
                // collect field names from custom editors
                    .map(property => editors?.[property]?.properties || property)
                    .flat()
                    .filter(Boolean)
            )
        );
        const validation = getValidation(mergedSchema, fields);
        const dropdownNames = fields
            .map(name => {
                const property =
                    lodashGet(mergedSchema.properties, name?.replace(/\./g, '.properties.')) ||
                    lodashGet(mergedSchema.properties, name?.replace(/\./g, '.items.properties.'));
                return [
                    property?.widget?.dropdown,
                    property?.widget?.pivot?.dropdown
                ];
            })
            .flat()
            .filter(Boolean);
        const getValue = (value) => {
            const editValue = {};
            fields.forEach(field => {
                const fieldValue = lodashGet(value, field);
                if (fieldValue !== undefined) lodashSet(editValue, field, fieldValue);
            });
            return editValue;
        };
        return [validation, dropdownNames, getValue];
    }, [mergedCards, editors, filter?.widgets, items, layout, mergedSchema]);

    async function get() {
        setLoading('loading');
        const [result, dropdownResult, customizationResult] = await Promise.all([
            onGet({[keyField]: keyValue}),
            onDropdown(dropdownNames),
            customizationEnabled && methods && !customization && methods['portal.component.get']({componentId: name})
        ]);
        handleArray(result, properties);
        if (typeField) setMode(['edit', lodashGet(result, typeField)]);
        setDropdown(dropdownResult);
        customizationResult?.component && setCustomization({schema: {}, card: {}, layout: {}, ...(customizationResult.component as {componentConfig?:object}).componentConfig});
        setLoadedValue(result);
        setLoading('');
    }
    async function init() {
        setLoading('loading');
        const [dropdownResult, customizationResult] = await Promise.all([
            onDropdown(dropdownNames),
            customizationEnabled && methods && !customization && methods['portal.component.get']({componentId: name})
        ]);
        setDropdown(dropdownResult);
        customizationResult?.component && setCustomization({schema: {}, card: {}, layout: {}, ...(customizationResult.component as {componentConfig?:object}).componentConfig});
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

    const handleCustomization = React.useCallback(
        function handleCustomization(event) {
            (onCustomization || methods['portal.component.edit'])({component: {componentId: name, componentConfig: mergedCustomization}});
        },
        [onCustomization, methods, mergedCustomization, name]
    );

    useLoad(async() => {
        if (keyValue) await get();
        else await init();
    });

    const [addField, setAddField] = React.useState(null);
    const [addCard, setAddCard] = React.useState(null);

    const move = React.useCallback((type: 'card' | 'field', source, destination) => {
        if (type === 'field') {
            if (source.card === '/') {
                setAddField({destination});
            } else {
                setCustomization(prev => {
                    const destinationList = [...prev.card[destination.card]?.widgets || cards[destination.card].widgets];
                    const sourceList = (source.card === destination.card)
                        ? destinationList
                        : [...prev.card[source.card]?.widgets || cards[source.card].widgets];
                    destinationList.splice(destination.index, 0, sourceList.splice(source.index, 1)[0]);
                    return {
                        ...prev,
                        card: {
                            ...prev.card,
                            [source.card]: {
                                ...prev.card[source.card],
                                widgets: sourceList
                            },
                            [destination.card]: {
                                ...prev.card[destination.card],
                                widgets: destinationList
                            }
                        }
                    };
                });
            }
        } else if (type === 'card') {
            const newLayout = layout.map(item => Array.isArray(item) ? [...item] : item);
            let [
                destinationList,
                destinationIndex
            ] = (destination.index[1] === false) ? [
                newLayout,
                destination.index[0]
            ] : [
                newLayout[destination.index[0]],
                destination.index[1]
            ];
            if (!Array.isArray(destinationList)) {
                const card = newLayout[destination.index[0]];
                if (typeof card === 'string') destinationList = newLayout[destination.index[0]] = [card];
            }
            if (source.index[0] === false && Array.isArray(destinationList)) {
                setAddCard({destinationList, destinationIndex, newLayout, currentLayoutName});
                return;
            }
            const [
                sourceList,
                sourceIndex,
                sourceNested
            ] = (source.index[1] === false) ? [
                newLayout,
                source.index[0],
                false
            ] : [
                newLayout[source.index[0]],
                source.index[1],
                true
            ];
            if (Array.isArray(sourceList) && Array.isArray(destinationList)) {
                setCustomization(prev => {
                    const removed = sourceList.splice(sourceIndex, 1)[0];
                    if (sourceList.length === 1 && sourceNested && sourceList !== destinationList) newLayout[source.index[0]] = sourceList[0];
                    destinationList.splice(destinationIndex, 0, removed);
                    return {
                        ...prev,
                        layout: {
                            ...prev.layout,
                            [currentLayoutName]: newLayout
                        }
                    };
                });
            }
        }
    }, [cards, layout, currentLayoutName]);

    const remove = React.useCallback((type, source) => {
        if (type === 'card') {
            const newLayout = layout.map(item => Array.isArray(item) ? [...item] : item);
            const [
                sourceList,
                sourceIndex,
                sourceNested
            ] = (source.index[1] === false) ? [
                newLayout,
                source.index[0],
                false
            ] : [
                newLayout[source.index[0]],
                source.index[1],
                true
            ];
            if (Array.isArray(sourceList)) {
                setCustomization(prev => {
                    sourceList.splice(sourceIndex, 1);
                    if (sourceList.length === 1 && sourceNested) newLayout[source.index[0]] = sourceList[0];
                    return {
                        ...prev,
                        layout: {
                            ...prev.layout,
                            [currentLayoutName]: newLayout
                        }
                    };
                });
            }
        } else if (type === 'field') {
            if (source.card !== '/') {
                const sourceList = mergedCards[source.card].widgets;
                sourceList.splice(source.index, 1);
                setCustomization(prev => {
                    return {
                        ...prev,
                        card: {
                            ...prev.card,
                            [source.card]: {
                                ...prev.card[source.card],
                                widgets: sourceList
                            }
                        }
                    };
                });
            }
        }
    }, [layout, currentLayoutName, mergedCards]);

    const [design, toggleDesign] = useToggle(designDefault);
    return (
        <>
            <ConfirmPopup />
            {design ? <SelectField
                schema={mergedSchema}
                visible={!!addField}
                onHide={() => setAddField(null)}
                onSelect={items => {
                    const {destination} = addField;
                    setCustomization(prev => {
                        const destinationList = [...prev.card[destination.card]?.widgets || cards[destination.card].widgets];
                        destinationList.splice(destination.index, 0, ...items);
                        return {
                            ...prev,
                            card: {
                                ...prev.card,
                                [destination.card]: {
                                    ...prev.card[destination.card],
                                    widgets: destinationList
                                }
                            }
                        };
                    });
                }}
            /> : null }
            {design ? <SelectCard
                cards={mergedCards}
                visible={!!addCard}
                onHide={() => setAddCard(null)}
                onSelect={item => {
                    const {destinationList, destinationIndex, newLayout, currentLayoutName} = addCard;
                    setCustomization(prev => {
                        destinationList.splice(destinationIndex, 0, item);
                        return {
                            ...prev,
                            layout: {
                                ...prev.layout,
                                [currentLayoutName]: newLayout
                            }
                        };
                    });
                }}
            /> : null }
            {toolbar ? <Toolbar
                className='border-none border-bottom-1 border-50'
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
                right={<>
                    {design ? <>
                        {(onCustomization || methods) ? <Button
                            icon='pi pi-save'
                            onClick={handleCustomization}
                            aria-label='save customization'
                            className='mr-2'
                            {...testid(name + 'saveCustomization')}
                        /> : null}
                        <ConfigCard
                            className='mr-2'
                            title='[ add card ]'
                            card=''
                            index1={false}
                            index2={false}
                            design
                            drag
                        >
                            <Button icon='pi pi-id-card' className='cursor-move'/>
                        </ConfigCard>
                        <ConfigField
                            className='flex mr-2'
                            index={name}
                            name={name}
                            card='/'
                            design
                            label='[add field]'
                        >
                            <Button icon='pi pi-pencil'/>
                        </ConfigField>
                    </> : null}
                    {customizationEnabled ? <Permission permission='portal.component.edit'>
                        <Button
                            icon='pi pi-cog'
                            onClick={toggleDesign}
                            disabled={!!loading}
                            aria-label='design'
                            {...testid(name + 'designButton')}
                            className={clsx('mr-2', design && 'p-button-success')}
                        /></Permission> : null}
                </>}
            /> : null}
            <div className={clsx('flex', 'overflow-x-hidden', 'w-full', orientation === 'top' && 'flex-column')}>
                {items && <ThumbIndex name={name} items={items} orientation={orientation} onFilter={setFilter}/>}
                <div className='flex flex-grow-1'>
                    <Form
                        schema={mergedSchema}
                        move={move}
                        debug={debug}
                        editors={editors}
                        design={design}
                        cards={mergedCards}
                        layout={layout || filter?.widgets || []}
                        onSubmit={handleSubmit}
                        onChange={onChange}
                        inspected={inspected}
                        onInspect={setInspected}
                        methods={methods}
                        value={value}
                        dropdowns={dropdowns}
                        loading={loading}
                        setTrigger={setTrigger}
                        validation={validation}
                        toolbarRef={toolbarRef}
                        toolbar={toolbarName}
                    />
                    {design && <div className='col-2 flex-column'>
                        {inspected ? <Inspector
                            Editor={Editor}
                            className='w-full'
                            onChange={setCustomization}
                            object={inspected.type === 'card' ? mergedCards : mergedSchema}
                            property={inspected.type === 'card' ? inspected.name : `properties.${inspected.name.split('.').join('.properties.')}`}
                            type={inspected.type}
                        /> : null }
                        <ConfigField
                            index='trash'
                            design
                            move={remove}
                            label='trash'
                            name='trash'
                            className='text-center p-3 p-card'
                        ><i className='pi pi-trash'/></ConfigField>
                    </div>}
                </div>
            </div>
        </>
    );
};

export default Editor;
