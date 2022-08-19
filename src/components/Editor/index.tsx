import React from 'react';
import lodashGet from 'lodash.get';
import lodashSet from 'lodash.set';
import merge from 'ut-function.merge';
import clsx from 'clsx';

import { ComponentProps } from './Editor.types';

import Form from '../Form';
import getValidation from '../Form/schema';
import ThumbIndex from '../ThumbIndex';
import Inspector from '../Inspector';
import {Toolbar, Button, ConfirmPopup, confirmPopup} from '../prime';
import useToggle from '../hooks/useToggle';
import useNow from '../hooks/useNow';
import useLoad from '../hooks/useLoad';
import {ConfigField, ConfigCard} from '../Form/DragDrop';
import prepareSubmit from '../lib/prepareSubmit';
import testid from '../lib/testid';
import type {Cards, Layouts} from '../types';

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
    return [items, layout, orientation || 'left', toolbar];
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
    const [keyValue, setKeyValue] = React.useState(id);
    const activeSchema = (schemaCreate && keyValue == null) ? schemaCreate : schemaEdit;
    const [override, setOverride] = React.useState({});
    const [inspected, setInspected] = React.useState(null);
    const mergedSchema = React.useMemo(() => merge({}, activeSchema, override), [activeSchema, override]);
    const {properties = empty} = mergedSchema;
    name = name ? name + '.' : '';

    const [trigger, setTrigger] = React.useState();
    const [didSubmit, setDidSubmit] = React.useState(false);
    const [value, setEditValue] = React.useState({});
    const [loadedValue, setLoadedValue] = React.useState<object>();
    const [dropdowns, setDropdown] = React.useState({});
    const [[items, layout, orientation, toolbarName], setIndex] = React.useState(() => getLayout(cards, layouts, id == null ? 'create' : 'edit', layoutName));
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
                    .map(card => cards?.[card]?.widgets)
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
    }, [cards, editors, filter?.widgets, items, layout, mergedSchema]);

    async function get() {
        setLoading('loading');
        const result = (await onGet({[keyField]: keyValue}));
        handleArray(result, properties);
        if (typeField) setIndex(getLayout(cards, layouts, 'edit', lodashGet(result, typeField)));
        setDropdown(await onDropdown(dropdownNames));
        setLoadedValue(result);
        setLoading('');
    }
    async function init() {
        setLoading('loading');
        setDropdown(await onDropdown(dropdownNames));
        if (onInit) initValue = merge({}, initValue, await onInit(initValue));
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
            if (keyValue != null) {
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
            setIndex(getLayout(cards, layouts, 'edit', layoutName || (typeField ? lodashGet(value, typeField) : '')));
        }, [keyValue, onEdit, getValue, onAdd, keyField, resultSet, properties, layouts, cards, typeField, layoutName]
    );

    const handleReset = React.useCallback(
        async function handleReset(event) {
            const accept = () => {
                const value = loadedValue ? getValue(loadedValue) : {[resultSet]: null};
                setEditValue(value);
                setIndex(getLayout(cards, layouts, 'edit', layoutName || (typeField ? lodashGet(value, typeField) : '')));
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
        }, [trigger, cards, layouts, layoutName, typeField, loadedValue, resultSet, getValue]
    );

    useLoad(async() => {
        if (keyValue) await get();
        else await init();
    });

    const moved = useNow();

    function remove(type, source) {
        if (type === 'card') {
            const visibleCards = layout || Object.keys(cards);
            const [
                sourceList,
                sourceIndex,
                sourceNested
            ] = (source.index[1] === false) ? [
                visibleCards,
                source.index[0],
                false
            ] : [
                visibleCards[source.index[0]],
                source.index[1],
                true
            ];
            if (Array.isArray(sourceList)) {
                sourceList.splice(sourceIndex, 1);
                if (sourceList.length === 1 && sourceNested) visibleCards[source.index[0]] = sourceList[0];
                moved();
            }
        } else if (type === 'field') {
            if (source.card !== '/') {
                const sourceList = cards[source.card].widgets;
                sourceList.splice(source.index, 1);
            }
            moved();
        }
    }

    const [design, toggleDesign] = useToggle(designDefault);
    return (
        <>
            <ConfirmPopup />
            {toolbar ? <Toolbar
                className='border-none border-bottom-1 border-50'
                style={backgroundNone}
                left={design ? <>
                    <ConfigCard
                        className='mr-3'
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
                        className='flex'
                        index={name}
                        name={name}
                        card='/'
                        design
                        label='[add field]'
                    >
                        <Button icon='pi pi-pencil'/>
                    </ConfigField>
                </> : <>
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
                    <Button
                        icon='pi pi-cog'
                        onClick={toggleDesign}
                        disabled={!!loading}
                        aria-label='design'
                        {...testid(name + 'designButton')}
                        className={clsx('mr-2', design && 'p-button-success')}
                    />
                </>}
            /> : null}
            <div className={clsx('flex', 'overflow-x-hidden', 'w-full', orientation === 'top' && 'flex-column')}>
                {items && <ThumbIndex name={name} items={items} orientation={orientation} onFilter={setFilter}/>}
                <div className='flex flex-grow-1'>
                    <Form
                        schema={mergedSchema}
                        debug={debug}
                        editors={editors}
                        design={design}
                        cards={cards}
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
                            className='w-full'
                            onChange={setOverride}
                            object={mergedSchema}
                            property={`properties.${inspected.split('.').join('.properties.')}`}
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
