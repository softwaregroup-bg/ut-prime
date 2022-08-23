import React from 'react';
import clsx from 'clsx';
import get from 'lodash.get';
import {createUseStyles} from 'react-jss';

import type { ComponentProps } from './Card.types';

import type { Card as CardType } from '../types';
import titleCase from '../lib/titleCase';
import { ConfigField, ConfigCard} from '../Form/DragDrop';
import input from './input';
import {CHANGE} from './const';
import Controller from '../Controller';

const inputClass = (index, classes, name, className) => ({
    ...classes?.default,
    ...classes?.[name]
}.input || name === '' ? className : ((index.properties[name]?.title !== '' || className) ? `col-12 ${className || 'md:col-8'}` : 'col-12'));

const useStyles = createUseStyles({
    card: {
        '& .p-card-body': {
            '& .p-card-content': {
                paddingBottom: 0
            }
        }
    }
});

const Card: ComponentProps = ({
    cardName,
    index1 = 0,
    index2 = 0,
    cards,
    layoutState,
    dropdowns,
    methods,
    loading,
    design,
    formApi,
    value,
    move,
    toolbar,
    inspected,
    onInspect,
    classNames
}) => {
    const classes = useStyles();
    const counter = React.useRef(0);
    const {formState, control, getValues, setValue, watch} = formApi || {};
    const InputWrap = React.useCallback(function Input({
        label,
        error,
        name,
        propertyName = name.replace('$.edit.', ''),
        className,
        ...widget
    }) {
        widget.parent = widget.parent || name.match(/^\$\.edit\.[^.]+/)?.[0].replace('.edit.', '.selected.') || widget?.selectionPath;
        const parent = widget.parent || layoutState.index.properties[propertyName]?.widget?.parent;
        const parentWatch = parent && watch && watch(parent);
        const inputWidget = {id: name.replace(/\./g, '-') || label, ...layoutState.index.properties[propertyName]?.widget, ...widget, parent};
        const render = ({field, fieldState}) => input(
            label,
            error,
            {
                className: clsx({'w-full': !['boolean'].includes(inputWidget.type)}, { 'p-invalid': fieldState.error }),
                ...field,
                onChange: (value, {select = false, field: changeField = true, children = true} = {}) => {
                    if (select) {
                        const prefix = `$.edit.${propertyName}.`;
                        const selectionPrefix = widget?.selectionPath || '$.selected';
                        setValue?.(
                            `${selectionPrefix}.${propertyName}`,
                            value,
                            selectionPrefix.startsWith('$.') ? {shouldDirty: false, shouldTouch: false} : {shouldDirty: true, shouldTouch: true}
                        );
                        layoutState.visibleProperties.forEach(property => {
                            if (property.startsWith(prefix)) {
                                setValue?.(
                                    property,
                                    value?.[property.substr(prefix.length)],
                                    {shouldDirty: false, shouldTouch: false}
                                );
                            }
                        });
                    }
                    try {
                        if (children) {
                            const items = layoutState.index.children[propertyName];
                            if (items) {
                                items.forEach(child => {
                                    let childValue = null;
                                    const autocompleteProp = child.split('.').pop();
                                    const autocomplete = value?.value?.[autocompleteProp] || value?.[autocompleteProp];
                                    if (layoutState.index.properties[propertyName]?.widget?.type === 'autocomplete' && autocomplete) childValue = autocomplete;
                                    setValue?.(child, childValue);
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
            inputClass(layoutState.index, classes, propertyName, className),
            className,
            inputWidget,
            layoutState.index.properties[propertyName],
            dropdowns,
            parentWatch,
            loading,
            getValues,
            counter,
            methods,
            !getValues && 'label'
        );
        return (name && control) ? <Controller
            control={control}
            name={name}
            render={render}
        /> : render({field: value ? {value: get(value, name.split('.').pop()), name} : {}, fieldState: {}});
    }, [
        layoutState.index,
        layoutState.visibleProperties,
        classes,
        dropdowns,
        loading,
        methods,
        getValues,
        setValue,
        control,
        watch,
        value
    ]);

    const InputWrapEdit = React.useCallback(
        function InputEdit({name, ...props}) {
            const Component = InputWrap; // this is to please eslint-plugin-react-hooks
            return <Component name={'$.edit.' + name} {...props}/>;
        },
        [InputWrap]
    );

    const Label = React.useCallback(({name, className = 'col-12 md:col-4', label = layoutState.index.properties?.[name]?.title}) => {
        if (label === undefined) label = titleCase(name.split('.').pop());
        return label
            ? <label className={className} htmlFor={name.replace(/\./g, '-')}>{label}</label>
            : null;
    }, [layoutState.index]);

    const ErrorLabel = React.useCallback(({name, className = 'col-12 md:col-4'}) => {
        const error = get(formState?.errors, name);
        return error
            ? <><small className={className}/><small className='col p-error'>{error.message}</small></>
            : null;
    }, [formState?.errors]);

    const field = (length: number, flex: string, cardName: string, classes: CardType['classes'], init = {}) => function field(widget, ind: number) {
        if (typeof widget === 'string') widget = {name: widget};
        const {
            name = '',
            id,
            propertyName = name.replace('$.edit.', '')
        } = widget;
        const parent = name.match(/^\$\.edit\.[^.]+/)?.[0].replace('.edit.', '.selected.');
        const property = layoutState.index.properties[propertyName];
        const {
            field: fieldClass = (typeof property === 'function') ? 'grid' : 'field grid',
            label: labelClass
        } = {...init, ...classes?.default, ...classes?.[propertyName]};
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
                    propertyName={propertyName}
                    parent={parent}
                    name=''
                    {...widget as object}
                    label={<Label name={propertyName} className={labelClass} label={widget.label}/>}
                    error={<ErrorLabel name={propertyName} className={labelClass} />}
                />
            );
        }
        return (property || name === '') ? <ConfigField
            className={clsx(fieldClass, flex, !toolbar && !design && (ind === length - 1) && 'mb-0')}
            key={id || name || widget.label}
            index={ind}
            card={cardName}
            move={move}
            design={design}
            name={name}
            inspected={inspected}
            onInspect={onInspect}
            label={property?.title}
        >
            {Field()}
        </ConfigField> : <div className="field grid" key={name}>❌ {name}</div>;
    };

    if (typeof cardName === 'object') cardName = cardName.name;
    const {label, widgets = [], flex, hidden, classes: cardClasses, type} = (cards[cardName] || {label: '❌ ' + cardName});
    if (type === 'toolbar') {
        return <>
            {widgets.length > 0 && widgets.map(field(widgets.length, flex, cardName, cardClasses, {field: '', label: ''}))}
        </>;
    }
    return (
        <ConfigCard
            title={label}
            key={`${index1}-${index2}`}
            className={clsx('card', formApi && 'mb-3', classes.card, cardClasses?.card)}
            card={cardName}
            id={cardName}
            index1={index1}
            index2={index2}
            move={move}
            flex={flex}
            design={design}
            hidden={hidden}
            inspected={inspected}
            onInspect={onInspect}
        >
            {widgets.length > 0 && <div className={clsx(flex && 'flex flex-wrap', cardClasses?.default?.root)}>
                {widgets.map(field(widgets.length, flex, cardName, cardClasses, classNames))}
            </div>}
        </ConfigCard>
    );
};

export default Card;
