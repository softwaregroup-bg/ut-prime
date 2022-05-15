import React from 'react';
import clsx from 'clsx';
import get from 'lodash.get';
import clonedeep from 'lodash.clonedeep';
import { joiResolver } from '@hookform/resolvers/joi';
import { DevTool } from '@hookform/devtools';

import { useStyles, ComponentProps } from './Form.types';
import { ConfigField, ConfigCard} from './DragDrop';
import Context from '../Context';
import input from './input';

import titleCase from '../lib/titleCase';
import { Properties, Editors, PropertyEditors } from '../types';
import useForm from '../hooks/useForm';
import useToggle from '../hooks/useToggle';
import useSubmit from '../hooks/useSubmit';
import Controller from '../Controller';
import getValidation from './schema';
import {CHANGE} from './const';
import getType from '../lib/getType';

const inputClass = (index, classes, name, className) => ({
    ...classes?.default,
    ...classes?.[name]
}.input || ((index.properties[name]?.title !== '' || className) ? `col-12 ${className || 'md:col-8'}` : 'col-12'));

const widgetName = name => typeof name === 'string' ? name : name.name;

const flatten = (properties: Properties, editors: Editors, root: string = '') : PropertyEditors => Object.entries(properties || {}).reduce(
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

const propertyType = property => property?.widget?.type || property?.format || getType(property?.type);

const getIndex = (properties: Properties, editors: Editors) : {
    properties: PropertyEditors,
    children: {[parent: string]: string[]},
    files: string[],
    tables: string[]
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
        }, {}),
        files: Object.entries(index).map(([name, property]) => propertyType(property) === 'file' && name).filter(Boolean),
        tables: Object.entries(index).map(([name, property]) => propertyType(property) === 'table' && name).filter(Boolean)
    };
};

interface Errors {
    message?: string
}

const flat = (e: Errors, path = '') => Object.entries(e).map(
    ([name, value]) => typeof value.message === 'string' ? (path ? path + '.' + name : name) : flat(value, path ? path + '.' + name : name)
).flat();

const outline = {outline: '1px dotted #ffff0030'};

const Form: ComponentProps = ({
    className,
    schema = {},
    editors,
    design,
    debug,
    cards,
    layout,
    loading,
    methods,
    onSubmit,
    setTrigger,
    triggerNotDirty,
    autoSubmit,
    value,
    dropdowns,
    validation,
    ...rest
}) => {
    const classes = useStyles();
    const {properties = {}} = schema;
    // console.log(joiSchema.describe());
    const resolver = React.useMemo(
        () => joiResolver(validation || getValidation(schema), {stripUnknown: true, abortEarly: false}),
        [validation, schema]
    );
    const {
        handleSubmit: formSubmit,
        control,
        reset,
        formState: {
            errors,
            isDirty
        },
        watch,
        setValue,
        getValues,
        setError,
        clearErrors
    } = useForm({resolver});
    const errorFields = flat(errors);
    const counter = React.useRef(0);
    const [visibleCards, visibleProperties] = React.useMemo(() => {
        const visibleCards: (string | string[])[] = (layout || Object.keys(cards));
        const widgetNames = widget => {
            widget = typeof widget === 'string' ? widget : widget.name;
            const editor = editors?.[widget.replace('$.edit.', '')];
            if (!editor) return widget;
            return widget.startsWith('$.edit.') ? editor.properties.map(name => '$.edit.' + name) : editor.properties;
        };
        return [
            visibleCards,
            Array.from(new Set(
                visibleCards.map(id => {
                    const nested = [].concat(id);
                    return nested.map(
                        cardName => cards[typeof cardName === 'string' ? cardName : cardName.name]?.widgets?.map(widgetNames)
                    );
                }).flat(10).filter(Boolean)
            ))
        ];
    }, [cards, layout, editors]);

    const [, moved] = useToggle();

    const idx = React.useMemo(() => getIndex(properties, editors), [properties, editors]);

    const {handleSubmit, toast} = useSubmit(
        async form => {
            try {
                clearErrors();
                return await onSubmit([form, idx]);
            } catch (error) {
                if (!Array.isArray(error.validation)) throw error;
                error.validation.forEach(({path = '', message = ''} = {}) => {
                    if (path && message) setError(path, {message});
                });
            }
        },
        [onSubmit, setError, clearErrors, idx]
    );

    const canSetTrigger = isDirty || triggerNotDirty;
    React.useEffect(() => {
        if (setTrigger) setTrigger(canSetTrigger ? prev => formSubmit(handleSubmit) : undefined);
    }, [setTrigger, formSubmit, handleSubmit, isDirty, canSetTrigger]);

    React.useEffect(() => {
        const {$original, ...formValue} = value || {};
        reset({...formValue, $original: clonedeep(formValue)});
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

    const InputWrap = React.useCallback(function Input({
        label,
        error,
        name,
        propertyName = name.replace('$.edit.', ''),
        className,
        ...widget
    }) {
        widget.parent = widget.parent || name.match(/^\$\.edit\.[^.]+/)?.[0].replace('.edit.', '.selected.');
        const parent = widget.parent || idx.properties[propertyName]?.widget?.parent;
        const parentWatch = parent && watch(parent);
        const inputWidget = {id: name.replace(/\./g, '-'), ...idx.properties[propertyName]?.widget, ...widget, parent};
        return (
            <Controller
                control={control}
                name={name}
                render={({field, fieldState}) => input(
                    label,
                    error,
                    {
                        className: clsx({'w-full': !['boolean'].includes(inputWidget.type)}, { 'p-invalid': fieldState.error }),
                        ...field,
                        onChange: (value, {select = false, field: changeField = true, children = true} = {}) => {
                            if (select) {
                                const prefix = `$.edit.${propertyName}.`;
                                const selectionPrefix = widget?.selectionPath || '$.selected';
                                setValue(
                                    `${selectionPrefix}.${propertyName}`,
                                    value,
                                    selectionPrefix.startsWith('$.') ? {shouldDirty: false, shouldTouch: false} : {shouldDirty: true, shouldTouch: true}
                                );
                                visibleProperties.forEach(property => {
                                    if (property.startsWith(prefix)) {
                                        setValue(
                                            property,
                                            value?.[property.substr(prefix.length)],
                                            {shouldDirty: false, shouldTouch: false}
                                        );
                                    }
                                });
                            }
                            try {
                                if (children) {
                                    const items = idx.children[propertyName];
                                    if (items) {
                                        items.forEach(child => {
                                            let childValue = null;
                                            const autocompleteProp = child.split('.').pop();
                                            const autocomplete = value?.value?.[autocompleteProp] || value?.[autocompleteProp];
                                            if (idx.properties[propertyName]?.widget?.type === 'autocomplete' && autocomplete) childValue = autocomplete;
                                            setValue(child, childValue);
                                        });
                                    }
                                }
                            } finally {
                                if (changeField) {
                                    field.onChange(value);
                                    if (parentWatch?.[CHANGE] && name.startsWith('$.edit.')) {
                                        const old = {...parentWatch};
                                        parentWatch[name.split('.').pop()] = value;
                                        parentWatch[CHANGE]({data: old, newData: parentWatch});
                                    }
                                }
                            }
                        }
                    },
                    inputClass(idx, classes, propertyName, className),
                    inputWidget,
                    idx.properties[propertyName],
                    dropdowns,
                    parentWatch,
                    loading,
                    getValues,
                    counter,
                    methods
                )}
            />
        );
    }, [classes, control, dropdowns, idx, loading, setValue, watch, getValues, visibleProperties, methods]);

    const InputWrapEdit = React.useCallback(
        function InputEdit({name, ...props}) {
            const Component = InputWrap; // this is to please eslint-plugin-react-hooks
            return <Component name={'$.edit.' + name} {...props}/>;
        },
        [InputWrap]
    );

    const Label = React.useCallback(({name, className = 'col-12 md:col-4'}) => {
        let label = idx.properties?.[name]?.title;
        if (label === undefined) label = titleCase(name.split('.').pop());
        return label
            ? <label className={className} htmlFor={name.replace(/\./g, '-')}>{label}</label>
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
        const {label, widgets = [], flex, hidden, classes} = (cards[cardName] || {label: '❌ ' + cardName});
        return (
            <ConfigCard title={label} key={`${index1}-${index2}`} className='card mb-3' card={cardName} id={cardName} index1={index1} index2={index2} move={move} flex={flex} design={design} hidden={hidden}>
                {widgets.length > 0 && <div className={clsx(flex && 'flex flex-wrap')}>
                    {widgets.map((widget, ind) => {
                        if (typeof widget === 'string') widget = {name: widget};
                        const {
                            name,
                            id,
                            propertyName = name.replace('$.edit.', '')
                        } = widget;
                        const parent = name.match(/^\$\.edit\.[^.]+/)?.[0].replace('.edit.', '.selected.');
                        const property = idx.properties[propertyName];
                        const {
                            field: fieldClass = (typeof property === 'function') ? 'grid' : 'field grid',
                            label: labelClass
                        } = {...classes?.default, ...classes?.[propertyName]};
                        function Field() {
                            if (typeof property === 'function') {
                                return property({
                                    name,
                                    Input: name.startsWith('$.edit.') ? InputWrapEdit : InputWrap,
                                    Label,
                                    ErrorLabel
                                });
                            }
                            return (
                                <InputWrap
                                    label={<Label name={propertyName} className={labelClass}/>}
                                    error={<ErrorLabel name={propertyName} className={labelClass} />}
                                    propertyName={propertyName}
                                    parent={parent}
                                    {...widget}
                                />
                            );
                        }
                        return property ? <ConfigField
                            className={clsx(fieldClass, flex)}
                            key={id || name}
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
                </div>}
            </ConfigCard>
        );
    }

    const {devTool} = React.useContext(Context);

    return (<>
        {devTool ? <DevTool control={control} placement="top-right" /> : null}
        {toast}
        <form {...rest} onSubmit={formSubmit(handleSubmit)} className={clsx('grid col align-self-start', classes.form, className)}>
            {
                !!Object.keys(errors).length && <div className='col-12'>
                    {errorFields.map(name => !visibleProperties.includes(name) && <><small className="p-error">{get(errors, name)?.message}</small><br /></>)}
                </div>
            }
            {visibleCards.map((id1, level1) => {
                const nested = [].concat(id1);
                const firstCard = cards[widgetName(nested[0])];
                const nestedCards = nested.map((widget, level2) => {
                    const key = widgetName(widget);
                    const currentCard = cards?.[key];
                    if (currentCard?.hidden && !design) return null;
                    const watched = currentCard?.watch && watch(currentCard.watch);
                    const match = currentCard?.match;
                    return (!match || (typeof match === 'object' ? Object.entries(match).every(([key, value]) => watched?.[key] === value) : match === watched)) ? card(widget, level1, Array.isArray(id1) && level2) : null;
                }).filter(Boolean);

                if (!nestedCards.length) return null;
                return (
                    <div key={level1} className={clsx('col-12', firstCard?.className || (!firstCard?.hidden && 'xl:col-6'))} {...(design || debug) && {style: outline}}>
                        {nestedCards}
                        <ConfigCard
                            title='[ add card ]'
                            className='card mb-3'
                            card=''
                            key={`${level1}-drop`}
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
                    title='[ add card ]'
                    className='card mb-3'
                    card=''
                    key={`${visibleCards.length}-drop`}
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

export default Form;
