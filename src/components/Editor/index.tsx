import React from 'react';
import lodashGet from 'lodash.get';
import lodashSet from 'lodash.set';
import merge from 'ut-function.merge';
import clsx from 'clsx';

import { ComponentProps } from './Editor.types';

import Form from '../Form';
import getValidation from '../Form/schema';
import ThumbIndex from '../ThumbIndex';
import {Toolbar, Button, Card, ConfirmPopup, confirmPopup} from '../prime';
import useToggle from '../hooks/useToggle';
import useLoad from '../hooks/useLoad';
import useWindowSize from '../hooks/useWindowSize';
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
    schema = {},
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
    onEdit
}) => {
    const {properties = empty} = schema;
    name = name ? name + '.' : '';

    const [keyValue, setKeyValue] = React.useState(id);
    const [trigger, setTrigger] = React.useState();
    const [didSubmit, setDidSubmit] = React.useState(false);
    const [value, setEditValue] = React.useState({});
    const [loadedValue, setLoadedValue] = React.useState<object>();
    const [dropdowns, setDropdown] = React.useState({});
    const [[items, layout, orientation, toolbar], setIndex] = React.useState(() => getLayout(cards, layouts, id == null ? 'create' : 'edit', layoutName));
    const [filter, setFilter] = React.useState(items?.[0]?.items?.[0] || items?.[0]);
    const [loading, setLoading] = React.useState('loading');
    const windowSize = useWindowSize();

    const [editorHeight, setEditorHeight] = React.useState(0);
    const editorWrapRef = React.useCallback(node => {
        if (node !== null) {
            const maxHeight = windowSize.height - node.getBoundingClientRect().top;
            setEditorHeight((!isNaN(maxHeight) && maxHeight > 0) ? Math.floor(maxHeight) : 0);
        }
    }, [windowSize.height]);

    const [validation, dropdownNames, getValue] = React.useMemo(() => {
        const columns = (propertyName, property) => []
            .concat(property?.hidden)
            .concat(property?.widgets)
            .filter(Boolean)
            .map(name => propertyName + '.' + name)
            .concat(propertyName);
        const widgetName = widget =>
            typeof widget === 'string'
                ? columns(widget, lodashGet(schema?.properties, widget?.replace(/\./g, '.properties.'))?.widget)
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
        const validation = getValidation(schema, fields);
        const dropdownNames = fields
            .map(name => {
                const property =
                    lodashGet(schema.properties, name?.replace(/\./g, '.properties.')) ||
                    lodashGet(schema.properties, name?.replace(/\./g, '.items.properties.'));
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
    }, [cards, editors, filter?.widgets, items, layout, schema]);

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

    const [, moved] = useToggle();

    function remove(type, source) {
        if (source.card !== '/') {
            const sourceList = cards[source.card].widgets;
            sourceList.splice(source.index, 1);
        }
        moved();
    }

    const [design, toggleDesign] = useToggle(designDefault);
    return (
        <>
            <ConfirmPopup />
            <Toolbar
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
                    <Button
                        icon='pi pi-cog'
                        onClick={toggleDesign}
                        disabled={!!loading}
                        aria-label='design'
                        {...testid(name + 'designButton')}
                        className={clsx('mr-2', design && 'p-button-success')}
                    />
                </>}
            />
            <div className={clsx('flex', 'overflow-x-hidden', 'w-full', orientation === 'top' && 'flex-column')}>
                {items && <ThumbIndex name={name} items={items} orientation={orientation} onFilter={setFilter}/>}
                <div ref={editorWrapRef} style={{maxHeight: editorHeight}} className='flex flex-grow-1'>
                    <Form
                        schema={schema}
                        debug={debug}
                        editors={editors}
                        design={design}
                        cards={cards}
                        layout={layout || filter?.widgets || []}
                        onSubmit={handleSubmit}
                        methods={methods}
                        value={value}
                        dropdowns={dropdowns}
                        loading={loading}
                        setTrigger={setTrigger}
                        validation={validation}
                        toolbarRef={toolbarRef}
                        toolbar={toolbar}
                    />
                    {design && <div style={{maxHeight: editorHeight}} className={clsx('col-2 flex-column overflow-y-auto')}>
                        <Card title='Fields' className='mb-2'>
                            <ConfigField
                                className='field grid'
                                index='trash'
                                design
                                move={remove}
                                label=''
                                name='trash'
                            ><i className='pi pi-trash m-3'></i></ConfigField>
                            {Object.entries(properties).map(([name, {title}], index) => <ConfigField
                                className='field grid'
                                key={index}
                                index={name}
                                name={name}
                                card='/'
                                design
                                label={title}
                            >{title || name}</ConfigField>)}
                        </Card>
                        <Card title='Cards'>
                            {Object.entries(cards).map(([name, {label}], index) => <ConfigCard
                                key={index}
                                title={label}
                                className='card mb-3'
                                card={name}
                                index1={false}
                                index2={false}
                                design
                                drag
                            />)}
                        </Card>
                    </div>}
                </div>
            </div>
        </>
    );
};

export default Editor;
