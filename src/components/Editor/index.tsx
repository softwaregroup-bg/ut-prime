import React from 'react';
import lodashGet from 'lodash.get';
import lodashSet from 'lodash.set';
import merge from 'ut-function.merge';
import clsx from 'clsx';

import { ComponentProps } from './Editor.types';

import Form from '../Form';
import getValidation from '../Form/schema';
import ThumbIndex from '../ThumbIndex';
import {Toolbar, Button, Card} from '../prime';
import useToggle from '../hooks/useToggle';
import useLoad from '../hooks/useLoad';
import {ConfigField, ConfigCard} from '../Form/DragDrop';
import prepareSubmit from '../lib/prepareSubmit';
import testid from '../lib/testid';

const backgroundNone = {background: 'none'};

const capital = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

function handleArray(result: {}, properties) {
    Object.entries(result).forEach(([name, value]) => {
        // back end wrongly returned an array with a single item
        if (Array.isArray(value) && properties[name]?.properties) result[name] = value[0];
    });
    return result;
}

const empty = {title: undefined};

const Editor: ComponentProps = ({
    object,
    id,
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
    onAdd,
    onGet,
    onEdit
}) => {
    const {properties = empty} = schema;
    const getLayout = React.useCallback((name = '') => {
        let items: any = layouts?.['edit' + capital(name)];
        let layout;
        const orientation = items?.orientation;
        if (orientation) items = items.items;
        if (typeof (items?.[0]?.[0] || items?.[0]) === 'string') {
            layout = items;
            items = false;
        } else layout = !items && ['edit' + capital(name)];
        return [items, layout, orientation || 'left'];
    }, [layouts]);
    name = name ? name + '.' : '';

    const [keyValue, setKeyValue] = React.useState(id);
    const [trigger, setTrigger] = React.useState();
    const [value, setEditValue] = React.useState({});
    const [loadedValue, setLoadedValue] = React.useState<{}>();
    const [dropdowns, setDropdown] = React.useState({});
    const [[items, layout, orientation], setIndex] = React.useState(() => getLayout(layoutName));
    const resultLayout = React.useMemo(() => layouts?.editResult && getLayout('result'), [layouts, getLayout]);
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
        if (typeField) setIndex(getLayout(lodashGet(result, typeField)));
        setDropdown(await onDropdown(dropdownNames));
        setLoadedValue(result);
        setLoading('');
    }
    async function init() {
        setLoading('loading');
        setDropdown(await onDropdown(dropdownNames));
        setLoading('');
    }

    React.useEffect(() => {
        if (loadedValue !== undefined) setEditValue(getValue(loadedValue));
    }, [loadedValue, getValue, setEditValue]);

    const handleSubmit = React.useCallback(
        async function handleSubmit(data) {
            if (keyValue != null) {
                const response = getValue(handleArray(await onEdit(prepareSubmit(data)), properties));
                setEditValue(merge({}, data[0], response));
            } else {
                const response = getValue(handleArray(await onAdd(prepareSubmit(data)), properties));
                setKeyValue(lodashGet(response, `${resultSet}.${keyField}`));
                setEditValue(merge({}, data[0], response));
            }
            if (resultLayout) setIndex(resultLayout);
        }, [keyValue, onEdit, getValue, onAdd, keyField, resultSet, properties, resultLayout]
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
            <Toolbar
                style={backgroundNone}
                left={
                    <Button
                        icon='pi pi-save'
                        onClick={trigger}
                        disabled={!trigger || !!loading}
                        aria-label='save'
                        {...testid(name + 'saveButton')}
                    />
                }
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
                <div className='flex flex-grow-1'>
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
                    />
                    {design && <div className='col-2 flex-column'>
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
