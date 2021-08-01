import React from 'react';
import lodashGet from 'lodash.get';
import merge from 'ut-function.merge';

import { Styled, StyledType } from './Editor.types';

import Form from '../Form';
import ThumbIndex from '../ThumbIndex';
import {Toolbar, Button} from '../prime';

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
    onDropdown,
    onAdd,
    onGet,
    onEdit
}) => {
    function getLayout(name = '') {
        let index = layouts?.['edit' + capital(name)];
        let layout;
        if (typeof index?.[0] === 'string') {
            layout = index;
            index = false;
        } else layout = !index && ['edit' + capital(name)];
        return [index, layout];
    }

    const [trigger, setTrigger] = React.useState();
    const [value, setValue] = React.useState({});
    const [dropdowns, setDropdown] = React.useState({});
    const [[index, layout], setIndex] = React.useState(getLayout(layoutName));
    const [filter, setFilter] = React.useState(index?.[0]?.items?.[0]);
    const dropdownNames = (layout || filter?.cards || [])
        .flat()
        .map(card => cards?.[card]?.properties)
        .flat()
        .filter(Boolean)
        .map(name => lodashGet(properties, name?.replace(/\./g, '.properties.'))?.editor?.dropdown)
        .filter(Boolean);
    async function get() {
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
    }
    async function init() {
        setDropdown(await onDropdown(dropdownNames));
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
    return (
        <>
            <Toolbar
                left={
                    <Button icon='pi pi-save' onClick={trigger} disabled={!trigger}/>
                }
            />
            <div className='p-d-flex' style={{overflowX: 'hidden', width: '100%'}}>
                {index && <ThumbIndex index={index} onFilter={setFilter}/>}
                <Form
                    properties={properties}
                    cards={cards}
                    layout={layout || filter?.cards || []}
                    onSubmit={handleSubmit}
                    value={value}
                    dropdowns={dropdowns}
                    setTrigger={setTrigger}
                />
            </div>
        </>
    );
};

export default Styled(Editor);
