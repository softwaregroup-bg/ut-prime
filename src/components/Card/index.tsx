import React from 'react';
import clsx from 'clsx';
import get from 'lodash.get';
import {createUseStyles} from 'react-jss';

import type { ComponentProps } from './Card.types';

import type { Card as CardType } from '../types';
import Text from '../Text';
import titleCase from '../lib/titleCase';
import { ConfigField, ConfigCard} from '../Form/DragDrop';
import input from './input';
import {CHANGE} from './const';
import Controller from '../Controller';

const getFieldClass = (index, classes, name, className) =>
    name === '' ? className : clsx(
        'flex align-items-center relative col-12', {
            ...classes?.default,
            ...classes?.[name]
        }.field || ((index.properties[name]?.title !== '' || className) && (className || 'md:col-8'))
    );

const useStyles = createUseStyles({
    card: {
        '& .p-card-body': {
            '& .p-card-content': {
                paddingBottom: 0
            }
        },
        '& .p-chips': {
            '& .p-inputtext': {
                alignContent: 'flex-start'
            }
        }
    }
});

const useLabelStyles = createUseStyles({
    required: {
        '&:after': {
            content: '"*"'
        }
    }
});

const Card: ComponentProps = ({
    cardName,
    index1 = 0,
    last1,
    index2 = 0,
    last2,
    cards,
    layoutState,
    dropdowns,
    methods,
    loading,
    design,
    formApi,
    value,
    submit,
    move,
    toolbar,
    inspected,
    onInspect,
    onFieldChange,
    isPropertyRequired = () => false,
    classNames
}) => {
    const classes = useStyles();
    const labelClasses = useLabelStyles();
    const counter = React.useRef(0);
    const InputWrap = React.useCallback(function Input({
        Label,
        ErrorLabel,
        labelClass: defaultLabelClass,
        name,
        propertyName = name.replace('$.edit.', ''),
        classes,
        ...widget
    }) {
        widget.parent = widget.parent || name.match(/^\$\.edit\.[^.]+/)?.[0].replace('.edit.', '.selected.') || widget?.selectionPath;
        const parent = widget.parent || layoutState.index.properties[propertyName]?.widget?.parent;
        const parentWatch = parent && formApi?.watch?.(parent);
        const {
            fieldClass = null,
            labelClass = defaultLabelClass,
            onChange = onFieldChange,
            ...inputWidget
        } = {id: name.replace(/\./g, '-') || widget.label, ...layoutState.index.properties[propertyName]?.widget, ...widget, parent};
        if (!inputWidget.className) {
            const inputClassName = classes?.default?.input || classes?.[name]?.input;
            if (inputClassName) inputWidget.className = inputClassName;
        }
        const render = ({field, fieldState}) => input(
            Label && <Label name={propertyName} className={labelClass} label={widget.label} isRequired={isPropertyRequired(propertyName)}/>,
            ErrorLabel && <ErrorLabel name={propertyName} className={labelClass} />,
            {
                className: clsx({'w-full': !['boolean'].includes(inputWidget.type)}, { 'p-invalid': fieldState.error }),
                ...field,
                onChange: async(event: {value: unknown, originalEvent: unknown}, {select = false, field: changeField = true, children = true} = {}) => {
                    if (onChange && methods) {
                        try {
                            if (await methods[onChange]({
                                field,
                                value: event.value,
                                event: event.originalEvent,
                                form: formApi
                            }) === false) return;
                        } catch (error) {
                            formApi.setError(field.name, {message: error.message});
                            return;
                        }
                    }
                    if (select) {
                        const prefix = `$.edit.${propertyName}.`;
                        const selectionPrefix = widget?.selectionPath || '$.selected';
                        formApi?.setValue?.(
                            `${selectionPrefix}.${propertyName}`,
                            event?.value,
                            selectionPrefix.startsWith('$.') ? {shouldDirty: false, shouldTouch: false} : {shouldDirty: true, shouldTouch: true}
                        );
                        layoutState.visibleProperties.forEach(property => {
                            if (property.startsWith(prefix)) {
                                formApi?.setValue?.(
                                    property,
                                    event?.value?.[property.substr(prefix.length)],
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
                                    const autocomplete = (event as {value?: Record<string, unknown>})?.value?.[autocompleteProp];
                                    if (layoutState.index.properties[propertyName]?.widget?.type === 'autocomplete' && autocomplete) childValue = autocomplete;
                                    formApi?.setValue?.(child, childValue);
                                });
                            }
                        }
                    } finally {
                        if (changeField) {
                            field.onChange(event.value);
                            if (parentWatch?.[CHANGE] && name.startsWith('$.edit.')) {
                                const old = {...parentWatch};
                                parentWatch[name.split('.').pop()] = event?.value;
                                parentWatch[CHANGE]({data: old, newData: parentWatch});
                            }
                        }
                    }
                }
            },
            getFieldClass(layoutState.index, classes, propertyName, fieldClass),
            inputWidget.className,
            inputWidget,
            layoutState.index.properties[propertyName],
            dropdowns,
            parentWatch,
            loading,
            formApi?.getValues,
            formApi?.setValue,
            counter,
            methods,
            submit,
            !formApi?.getValues && 'label'
        );
        return (name && formApi?.control) ? <Controller
            control={formApi.control}
            name={name}
            render={render}
        /> : render({field: value ? {value: get(value, name.split('.').pop()), name} : {}, fieldState: {}});
    }, [
        layoutState.index,
        layoutState.visibleProperties,
        dropdowns,
        loading,
        methods,
        submit,
        formApi,
        onFieldChange,
        value,
        isPropertyRequired
    ]);

    const InputWrapEdit = React.useCallback(
        function InputEdit({name, ...props}) {
            const Component = InputWrap; // this is to please eslint-plugin-react-hooks
            return <Component name={'$.edit.' + name} {...props}/>;
        },
        [InputWrap]
    );

    const Label = React.useCallback(({name, className = 'md:col-4', label = layoutState.index.properties?.[name]?.title, isRequired = false}) => {
        if (label === undefined) label = titleCase(name.split('.').pop());
        return label
            ? <label className={clsx('col-12', className, {[labelClasses.required]: isRequired})} htmlFor={name.replace(/\./g, '-')}><Text>{label}</Text></label>
            : null;
    }, [layoutState.index, labelClasses.required]);

    const ErrorLabel = React.useCallback(({name, className = 'md:col-4'}) => {
        const error = get(formApi?.formState?.errors, name);
        return error
            ? <><small className={clsx('col-12', className)}/><small className='col p-error'>{error.message}</small></>
            : null;
    }, [formApi?.formState?.errors]);

    let formValues;
    const values = () => {
        formValues = formValues || formApi.getValues();
        return formValues;
    };

    if (typeof cardName === 'object') cardName = cardName.name;
    let cardDisabled = cards[cardName]?.disabled;
    if (typeof cardDisabled === 'object' && 'validate' in cardDisabled) cardDisabled = !cardDisabled.validate(values()).error;

    const field = (length: number, flex: string, cardName: string, classes: CardType['classes'], init = {}) => function field(widget, ind: number) {
        if (typeof widget === 'string') widget = {name: widget};
        let disabled = widget.disabled || cardDisabled;
        if (disabled?.validate) disabled = !disabled.validate(values()).error;
        const {
            name = '',
            id,
            propertyName = name.replace('$.edit.', '')
        } = widget;
        const parent = name.match(/^\$\.edit\.[^.]+/)?.[0].replace('.edit.', '.selected.');
        const property = layoutState.index.properties[propertyName];
        const {
            widget: widgetClass = (typeof property === 'function') ? 'grid' : 'field grid',
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
                    Label={Label}
                    ErrorLabel={ErrorLabel}
                    propertyName={propertyName}
                    parent={parent}
                    name=''
                    classes={classes}
                    labelClass={labelClass}
                    {...widget as object}
                    {...disabled != null && {disabled}}
                />
            );
        }
        return (property || name === '') ? <ConfigField
            className={clsx(widgetClass, flex, !toolbar && !design && (ind === length - 1) && 'mb-0')}
            key={id || name || widget.label || ind}
            index={ind}
            card={cardName}
            move={move}
            design={design}
            name={name}
            inspected={inspected}
            onInspect={onInspect}
            type='field'
            label={property?.title}
        >
            {Field()}
        </ConfigField> : <div className="field grid" key={name}>❌ {name}</div>;
    };

    const {label, widgets = [], flex, hidden, classes: cardClasses, type} = (cards[cardName] || {label: '❌ ' + cardName});
    if (type === 'toolbar') {
        return <div className='flex'>
            {widgets.length > 0 && widgets.map(field(widgets.length, flex, cardName, cardClasses, {widget: '', label: ''}))}
        </div>;
    }
    return (
        <ConfigCard
            title={label}
            key={`${index1}-${index2}`}
            className={clsx('card', formApi && (index2 !== last2) && 'mb-3', classes.card, cardClasses?.card)}
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
