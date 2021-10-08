import React from 'react';
import lodashGet from 'lodash.get';
import lodashSet from 'lodash.set';
import merge from 'ut-function.merge';
import clsx from 'clsx';

import { Styled, StyledType } from './Editor.types';

import Form from '../Form';
import getSchema from '../Form/schema';
import ThumbIndex from '../ThumbIndex';
import {Toolbar, Button, Card} from '../prime';
import useToggle from '../hooks/useToggle';
import useLoad from '../hooks/useLoad';
import {ConfigField, ConfigCard} from '../Form/DragDrop';

const flexGrow = {flexGrow: 1};
const backgroundNone = {background: 'none'};

const capital = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const Editor: StyledType = ({
    object,
    id,
    properties,
    editors,
    type,
    typeField,
    cards,
    layouts,
    layoutName,
    nested,
    keyField = object + 'Id',
    resultSet = object,
    design: designDefault,
    onDropdown,
    onAdd,
    onGet,
    onEdit
}) => {
    function getLayout(name = '') {
        let index: any = layouts?.['edit' + capital(name)];
        let layout;
        const orientation = index?.orientation;
        if (orientation) index = index.index;
        if (typeof (index?.[0]?.[0] || index?.[0]) === 'string') {
            layout = index;
            index = false;
        } else layout = !index && ['edit' + capital(name)];
        return [index, layout, orientation || 'left'];
    }

    const [keyValue, setKeyValue] = React.useState(id);
    const [trigger, setTrigger] = React.useState();
    const [value, setEditValue] = React.useState({});
    const [dropdowns, setDropdown] = React.useState({});
    const [[index, layout, orientation], setIndex] = React.useState(getLayout(layoutName));
    const [filter, setFilter] = React.useState(index?.[0]?.items?.[0] || index?.[0]);
    const [loading, setLoading] = React.useState('');
    const [validation, dropdownNames, setValue] = React.useMemo(() => {
        const indexCards = index && index.map(item => [item.cards, item?.items?.map(item => item.cards)]).flat(2).filter(Boolean);
        const fields: string[] = Array.from(new Set((indexCards || layout || filter?.cards || [])
            .flat()
            .map(card => cards?.[card]?.properties)
            .flat()
            .map(property => editors?.[property]?.properties || property)
            .flat()
            .filter(Boolean)));
        const validation = getSchema(properties, fields);
        const dropdownNames = fields
            .map(name => lodashGet(properties, name?.replace(/\./g, '.properties.'))?.editor?.dropdown)
            .filter(Boolean);
        const setValue = (value) => {
            const editValue = {};
            fields.forEach(field => lodashSet(editValue, field, lodashGet(value, field)));
            setEditValue(editValue);
        };
        return [validation, dropdownNames, setValue];
    }, [cards, editors, filter?.cards, index, layout, properties]);

    async function get() {
        setLoading('loading');
        let result = (await onGet({[keyField]: keyValue}));
        if (nested) {
            result = nested.reduce((prev, field) => ({
                ...prev,
                [field]: properties[field]?.properties ? [].concat(result[field])[0] : result[field]
            }), {});
        } else {
            result = result[resultSet];
            if (Array.isArray(result)) result = result[0];
        }
        if (typeField) setIndex(getLayout(result[typeField]));
        setDropdown(await onDropdown(dropdownNames));
        setValue(result);
        setLoading('');
    }
    async function init() {
        setLoading('loading');
        setDropdown(await onDropdown(dropdownNames));
        setLoading('');
    }

    const handleSubmit = React.useCallback(
        async function handleSubmit(instance) {
            if (keyValue != null) {
                const response = await onEdit(nested ? instance : {[object]: instance});
                setValue(prev => merge(instance, response));
            } else {
                const response = await onAdd(nested ? instance : {[object]: instance});
                setKeyValue(nested ? response[nested[0]][keyField] : response[keyField]);
                setValue(prev => merge(instance, response));
            }
        }, [keyValue, onEdit, nested, object, setValue, onAdd, keyField]
    );

    useLoad(async() => {
        if (keyValue) await get();
        else await init();
    });

    const [, moved] = useToggle();

    function remove(type, source) {
        if (source.card !== '/') {
            const sourceList = cards[source.card].properties;
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
                    <Button icon='pi pi-save' onClick={trigger} disabled={!trigger || !!loading} aria-label='save'/>
                }
                right={<>
                    <Button onClick={toggleDesign} className={clsx('mr-2', design && 'p-button-success')} disabled={!!loading} aria-label='design' icon='pi pi-cog' />
                </>}
            />
            <div className={clsx('flex', orientation === 'top' && 'flex-column')} style={{overflowX: 'hidden', width: '100%'}}>
                {index && <ThumbIndex index={index} orientation={orientation} onFilter={setFilter}/>}
                <div className='flex' style={flexGrow}>
                    <Form
                        properties={properties}
                        editors={editors}
                        design={design}
                        cards={cards}
                        layout={layout || filter?.cards || []}
                        onSubmit={handleSubmit}
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
                            {Object.entries(cards).map(([name, {title}], index) => <ConfigCard
                                key={index}
                                title={title}
                                className='card mb-3'
                                card={name}
                                index1={false}
                                index2={false}
                                design
                            />)}
                        </Card>
                    </div>}
                </div>
            </div>
        </>
    );
};

export default Styled(Editor);
