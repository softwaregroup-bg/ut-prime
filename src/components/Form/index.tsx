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
import useSubmit from '../hooks/useSubmit';
import Controller from '../Controller';
import getValidation from './schema';

const inputClass = (index, classes, name, className) => ({
    ...classes?.default,
    ...classes?.[name]
}.input || ((index.properties[name]?.title || className) ? `col-12 ${className || 'md:col-8'}` : 'col-12'));

const widgetName = name => typeof name === 'string' ? name : name.name;

const flatten = (properties: Properties, editors: Editors, root: string = '') : PropertyEditors => Object.entries(properties).reduce(
    (map, [name, property]) => {
        return ('properties' in property) ? {
            ...map,
            ...flatten(property.properties, {}, root + name + '.')
        } : ('items' in property) ? {
            ...map,
            [root + name]: property,
            ...flatten(property.items.properties, {}, root + name + '.')
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
            const parent = property?.widget?.parent;
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
    schema = {},
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
    const {properties = {}} = schema;
    const joiSchema = validation || getValidation(schema);
    // console.log(joiSchema.describe());
    const {handleSubmit: formSubmit, control, reset, formState: {errors, isDirty}, watch, setValue, setError, clearErrors} = useForm({resolver: joiResolver(joiSchema)});
    const visibleCards: (string | string[])[] = (layout || Object.keys(cards));
    const errorFields = flat(errors).flat();
    const visibleProperties = visibleCards.map(id => {
        const nested = [].concat(id);
        return nested.map(cardName => cards[typeof cardName === 'string' ? cardName : cardName.name]?.widgets);
    }).flat(10).filter(Boolean);

    const [, moved] = useToggle();

    const idx = React.useMemo(() => getIndex(properties, editors), [properties, editors]);

    const {handleSubmit, toast} = useSubmit(
        async form => {
            try {
                clearErrors();
                return await onSubmit(form);
            } catch (error) {
                if (!Array.isArray(error.validation)) throw error;
                error.validation.forEach(({path = '', message = ''} = {}) => {
                    if (path && message) setError(path, {message});
                });
            }
        },
        [onSubmit, setError, clearErrors]
    );

    React.useEffect(() => {
        if (setTrigger) setTrigger(isDirty ? prev => formSubmit(handleSubmit) : undefined);
    }, [setTrigger, formSubmit, handleSubmit, isDirty]);

    React.useEffect(() => {
        reset(value || {});
    }, [value, reset]);

    const move = React.useCallback((type: 'card' | 'field', source, destination) => {
        if (type === 'field') {
            const destinationList = cards[destination.card].widgets;
            if (source.card === '/') {
                destinationList.splice(destination.index, 0, source.index);
            } else {
                const sourceList = cards[source.card].widgets;
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

    const InputWrap = React.useCallback(({label, error, name, className, ...widget}) => {
        const parent = idx.properties[name]?.widget?.parent;
        return (
            <Controller
                control={control}
                name={name}
                render={({field, fieldState}) => input(
                    label,
                    error,
                    {
                        className: clsx('w-full', { 'p-invalid': fieldState.error }),
                        ...field,
                        value: field.value || '',
                        onChange: (e, {select = false, field: changeField = true, children = true} = {}) => {
                            if (select) {
                                setValue(`$.${field.name}.selected`, e);
                            }
                            try {
                                if (children) {
                                    const items = idx.children[field.name];
                                    if (items) items.forEach(child => setValue(child, null));
                                }
                            } finally {
                                if (changeField) field.onChange(e);
                            }
                        }
                    },
                    inputClass(idx, classes, field.name, className),
                    {id: field.name, ...idx.properties[field.name]?.widget, ...widget},
                    idx.properties[field.name],
                    dropdowns,
                    parent && {parent: watch(parent)},
                    loading
                )}
            />
        );
    }, [classes, control, dropdowns, idx, loading, setValue, watch]);

    const Label = React.useCallback(({name, className = 'col-12 md:col-4'}) => {
        const label = idx.properties?.[name]?.title;
        return label
            ? <label className={className} htmlFor={name}>{label}</label>
            : null;
    }, [idx]);

    const ErrorLabel = React.useCallback(({name, className = 'col-12 md:col-4'}) => {
        const error = get(errors, name);
        return error
            ? <><small className={className}/><small className='col p-error'>{error.message}</small></>
            : null;
    }, [errors]);

    function card(cardName, index1, index2) {
        if (typeof cardName === 'object') cardName = cardName.name;
        const {label, widgets = [], flex, hidden, classes} = (cards[cardName] || {title: '❌ ' + cardName});
        return (
            <ConfigCard title={label} key={`${index1}-${index2}`} className='card mb-3' card={cardName} id={cardName} index1={index1} index2={index2} move={move} flex={flex} design={design} hidden={hidden}>
                <div className={clsx(flex && 'flex flex-wrap')}>
                    {widgets.map((widget, ind) => {
                        if (typeof widget === 'string') widget = {name: widget};
                        const {name} = widget;
                        const property = idx.properties[name];
                        const {
                            field: fieldClass = (typeof property === 'function') ? 'grid' : 'field grid',
                            label: labelClass
                        } = {...classes?.default, ...classes?.[name]};
                        function Field() {
                            if (typeof property === 'function') return property({name: name, Input: InputWrap, Label, ErrorLabel});
                            return (
                                <InputWrap
                                    label={<Label name={name} className={labelClass}/>}
                                    error={<ErrorLabel name={name} className={labelClass} />}
                                    {...widget}
                                />
                            );
                        }
                        return property ? <ConfigField
                            className={clsx(fieldClass, flex)}
                            key={name}
                            index={ind}
                            card={cardName}
                            move={move}
                            design={design}
                            name={name}
                            label={property.title}
                        >
                            {Field()}
                        </ConfigField> : <div className="field grid" key={name}>❌ {name}</div>;
                    })}
                </div>
            </ConfigCard>
        );
    }

    return (<>
        <DevTool control={control} placement="top-right" />
        {toast}
        <form {...rest} onSubmit={formSubmit(handleSubmit)} className={clsx('grid col align-self-start', className)}>
            {
                !!Object.keys(errors).length && <div className='col-12'>
                    {errorFields.map(name => !visibleProperties.includes(name) && <><small className="p-error">{get(errors, name)?.message}</small><br /></>)}
                </div>
            }
            {visibleCards.map((id1, level1) => {
                const nested = [].concat(id1);
                const key = widgetName(nested[0]);
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
