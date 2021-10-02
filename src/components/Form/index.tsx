import React from 'react';
import clsx from 'clsx';
import get from 'lodash.get';
import { joiResolver } from '@hookform/resolvers/joi';
import { DevTool } from '@hookform/devtools';

import { Styled, StyledType } from './Form.types';
import { ConfigField, ConfigCard} from './DragDrop';
import input from './input';

import { Properties, Editors, PropertyEditors } from '../types';
import useForm from '../hooks/useForm';
import useToggle from '../hooks/useToggle';
import Controller from '../Controller';
import getSchema from './schema';

const inputClass = (index, classes, name, className) => ({
    ...classes?.default,
    ...classes?.[name]
}.input || ((index.properties[name]?.title || className) ? `col-12 ${className || 'md:col-8'}` : 'col-12'));

const Input = ({control, index, setValue, name, filter, dropdowns, loading, classes, className = ''}) => <Controller
    control={control}
    name={name}
    render={
        React.useCallback(({field, fieldState}) => <div className={inputClass(index, classes, field.name, className)}>{input(
            {
                className: clsx('w-full', { 'p-invalid': fieldState.error }),
                ...field,
                onChange: (e, {select = false, field: changeField = true, children = true} = {}) => {
                    if (select) {
                        setValue(`$.${field.name}.selected`, e);
                    }
                    try {
                        if (children) {
                            const items = index.children[field.name];
                            if (items) items.forEach(child => setValue(child, null));
                        }
                    } finally {
                        if (changeField) field.onChange(e);
                    }
                }
            },
            {id: field.name, ...index.properties[field.name]?.editor},
            index.properties[field.name],
            dropdowns,
            filter,
            loading
        )}</div>,
        [className, classes, dropdowns, filter, index, loading, setValue])
    }
/>;

const flatten = (properties: Properties, editors: Editors, root: string = '') : PropertyEditors => Object.entries(properties).reduce(
    (map, [name, property]) => {
        return ('properties' in property) ? {
            ...map,
            ...flatten(property.properties, {}, root + name + '.')
        } : {
            ...map,
            [root + name]: property
        };
    },
    {...editors}
);

const getIndex = (properties: Properties, editors: Editors) : {
    properties: PropertyEditors,
    children: {[parent: string]: string[]}
} => {
    const index = flatten(properties, editors);
    return {
        properties: index,
        children: Object.entries(index).reduce((prev, [name, property]) => {
            const parent = property?.editor?.parent;
            if (parent) {
                const items = prev[parent];
                if (items) items.push(name);
                else prev[parent] = [name];
            }
            return prev;
        }, {})
    };
};

interface Errors {
    message?: string
}

const flat = (e: Errors, path = '') => Object.entries(e).map(
    ([name, value]) => typeof value.message === 'string' ? (path ? path + '.' + name : name) : flat(value, name)
);

const outline = {outline: '1px dotted #ffff0030'};

const Form: StyledType = ({
    classes,
    className,
    properties,
    editors,
    design,
    cards,
    layout,
    loading,
    onSubmit,
    setTrigger,
    value,
    dropdowns,
    validation,
    ...rest
}) => {
    const joiSchema = validation || getSchema(properties);
    // console.log(joiSchema.describe());
    const {handleSubmit, control, reset, formState: {errors, isDirty}, watch, setValue} = useForm({resolver: joiResolver(joiSchema)});
    const visibleCards: (string | string[])[] = (layout || Object.keys(cards));
    const errorFields = flat(errors).flat();
    const visibleProperties = visibleCards.map(id => {
        const nested = [].concat(id);
        return nested.map(cardName => cards[cardName]?.properties);
    }).flat(10).filter(Boolean);

    const getFormErrorMessage = (name) => {
        const error = get(errors, name);
        return error && <small className="p-error">{error.message}</small>;
    };

    const [, moved] = useToggle();

    const idx = React.useMemo(() => getIndex(properties, editors), [properties, editors]);

    React.useEffect(() => {
        if (setTrigger) setTrigger(isDirty ? prev => handleSubmit(onSubmit) : undefined);
    }, [setTrigger, handleSubmit, onSubmit, isDirty]);

    React.useEffect(() => {
        reset(value || {});
    }, [value, reset]);

    const move = React.useCallback((type: 'card' | 'field', source, destination) => {
        if (type === 'field') {
            const destinationList = cards[destination.card].properties;
            if (source.card === '/') {
                destinationList.splice(destination.index, 0, source.index);
            } else {
                const sourceList = cards[source.card].properties;
                destinationList.splice(destination.index, 0, sourceList.splice(source.index, 1)[0]);
            }
        } else if (type === 'card') {
            let [
                destinationList,
                destinationIndex
            ] = (destination.index[1] === false) ? [
                visibleCards,
                destination.index[0]
            ] : [
                visibleCards[destination.index[0]],
                destination.index[1]
            ];
            if (!Array.isArray(destinationList)) {
                const card = visibleCards[destination.index[0]];
                if (typeof card === 'string') destinationList = visibleCards[destination.index[0]] = [card];
            }
            if (source.index[0] === false && Array.isArray(destinationList)) {
                destinationList.splice(destinationIndex, 0, source.card);
                moved();
                return;
            }
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
            if (Array.isArray(sourceList) && Array.isArray(destinationList)) {
                const removed = sourceList.splice(sourceIndex, 1)[0];
                if (sourceList.length === 1 && sourceNested && sourceList !== destinationList) visibleCards[source.index[0]] = sourceList[0];
                destinationList.splice(destinationIndex, 0, removed);
            }
        }
        moved();
    }, [cards, moved, visibleCards]);

    const InputWrap = React.useCallback(({name, className}) => {
        const parent = idx.properties[name]?.editor?.parent;
        return (
            <Input
                classes = {classes}
                control = {control}
                name = {name}
                dropdowns = {dropdowns}
                filter = {parent && {parent: watch(parent)}}
                loading = {loading}
                index = {idx}
                setValue = {setValue}
                className = {className}
            />
        );
    }, [classes, control, dropdowns, idx, loading, setValue, watch]);

    function card(id: string, index1, index2) {
        const {title, properties = [], flex, hidden, classes} = (cards[id] || {title: '❌ ' + id});
        return (
            <ConfigCard title={title} key={`${index1}-${index2}`} className='card mb-3' card={id} id={id} index1={index1} index2={index2} move={move} flex={flex} design={design} hidden={hidden}>
                <div className={clsx(flex && 'flex flex-wrap')}>
                    {properties.map((name, ind) => {
                        const property = idx.properties[name];
                        const Component = typeof property === 'function' && property;
                        const {
                            field: fieldClass = Component ? 'grid' : 'field grid',
                            label: labelClass
                        } = {...classes?.default, ...classes?.[name]};
                        return property ? <ConfigField
                            className={clsx(fieldClass, flex)}
                            key={name}
                            index={ind}
                            card={id}
                            move={move}
                            design={design}
                            name={name}
                            label={property.title}
                            labelClass={labelClass}
                        >
                            {Component ? <Component name={name} Input={InputWrap}/> : <InputWrap name={name}/>}
                            {getFormErrorMessage(name)}
                        </ConfigField> : <div className="field grid" key={name}>❌ {name}</div>;
                    })}
                </div>
            </ConfigCard>
        );
    }

    return (<>
        <DevTool control={control} placement="top-right" />
        <form {...rest} onSubmit={handleSubmit(onSubmit)} className={clsx('grid col align-self-start', className)}>
            {
                !!Object.keys(errors).length && <div className='col-12'>
                    {errorFields.map(name => !visibleProperties.includes(name) && <><small className="p-error">{get(errors, name)?.message}</small><br /></>)}
                </div>
            }
            {visibleCards.map((id1, level1) => {
                const nested = [].concat(id1);
                const key = nested[0];
                if (cards[key]?.hidden && !design) return null;
                return (
                    <div key={level1} className={clsx('col-12', cards[key]?.className || (!cards[key]?.hidden && 'xl:col-6'))} {...design && {style: outline}}>
                        {nested.map((id2, level2) => card(id2, level1, Array.isArray(id1) && level2))}
                        <ConfigCard
                            title='[ add row ]'
                            className='card mb-3'
                            card=''
                            index1={level1}
                            index2={nested.length}
                            move={move}
                            design={design}
                            drop
                        />
                    </div>
                );
            })}
            {design && <div className='col-12 xl:col-6' style={outline}>
                <ConfigCard
                    title='[ add column ]'
                    className='card mb-3'
                    card=''
                    index1={visibleCards.length}
                    index2={false}
                    move={move}
                    design={design}
                    drop
                />
            </div>}
        </form>
    </>);
};

export default Styled(Form);
