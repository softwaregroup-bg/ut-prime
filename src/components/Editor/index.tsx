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
import {DDField, DDCard} from '../Form/DragDrop';

const flexGrow = {flexGrow: 1};

const capital = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const Editor: StyledType = ({
    object,
    id,
    properties,
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

    const [trigger, setTrigger] = React.useState();
    const [value, setEditValue] = React.useState({});
    const [dropdowns, setDropdown] = React.useState({});
    const [[index, layout, orientation], setIndex] = React.useState(getLayout(layoutName));
    const [filter, setFilter] = React.useState(index?.[0]?.items?.[0] || index?.[0]);
    const [loading, setLoading] = React.useState('');
    const indexCards = index && index.map(item => [item.cards, item?.items?.map(item => item.cards)]).flat(2).filter(Boolean);
    const fields: string[] = Array.from(new Set((indexCards || layout || filter?.cards || [])
        .flat()
        .map(card => cards?.[card]?.properties)
        .flat()
        .filter(Boolean)));
    const validation = getSchema(properties, '', fields);
    const dropdownNames = fields
        .map(name => lodashGet(properties, name?.replace(/\./g, '.properties.'))?.editor?.dropdown)
        .filter(Boolean);
    function setValue(value) {
        const editValue = {};
        fields.forEach(field => lodashSet(editValue, field, lodashGet(value, field)));
        setEditValue(editValue);
    }
    async function get() {
        setLoading('loading');
        let result = (await onGet({[keyField]: id}));
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
            if (id != null) {
                const response = await onEdit(nested ? instance : {[object]: instance});
                setValue(prev => merge(instance, response));
            } else {
                const response = await onAdd(nested ? instance : {[object]: instance});
                id = nested ? response[nested[0]][keyField] : response[keyField];
                setValue(prev => merge(instance, response));
            }
        }, [onAdd, onEdit, id]
    );
    React.useEffect(() => {
        if (id) get();
        else init();
    }, []);

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
                left={
                    <Button icon='pi pi-save' onClick={trigger} disabled={!trigger || !!loading} aria-label='save'/>
                }
                right={
                    <Button icon='pi pi-cog' onClick={toggleDesign} {...design && {className: 'p-button-success'}} disabled={!!loading} aria-label='design'/>
                }
            />
            <div className={clsx('flex', orientation === 'top' && 'flex-column')} style={{overflowX: 'hidden', width: '100%'}}>
                {index && <ThumbIndex index={index} orientation={orientation} onFilter={setFilter}/>}
                <div className='flex' style={flexGrow}>
                    <Form
                        properties={properties}
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
                            <DDField
                                className='field grid'
                                index='trash'
                                design
                                move={remove}
                                label=''
                                name='trash'
                            ><i className='pi pi-trash m-3'></i></DDField>
                            {Object.entries(properties).map(([name, {title}], index) => <DDField
                                className='field grid'
                                key={index}
                                index={name}
                                name={name}
                                card='/'
                                design
                                label={title}
                                labelClass='col-12'
                            />)}
                        </Card>
                        <Card title='Cards'>
                            {Object.entries(cards).map(([name, {title}], index) => <DDCard
                                key={index}
                                title={title}
                                className='card mb-3'
                                card={name}
                                index={[false, false]}
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
