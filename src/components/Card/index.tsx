import React from 'react';
import clsx from 'clsx';
import get from 'lodash.get';
import {createUseStyles, useTheme} from 'react-jss';

import type { ComponentProps } from './Card.types';

import type { Theme } from '../Theme';
import type { Card as CardType } from '../types';
import Text from '../Text';
import titleCase from '../lib/titleCase';
import { ConfigField, ConfigCard} from '../Form/DragDrop';
import { useAllow } from '../hooks';

import Input from './input';

const useStyles = createUseStyles({
    card: {
        '& .p-card-body': {
            '& > .p-card-content': {
                paddingBottom: 0,
                paddingTop: 0
            },
            '& > .p-card-title': {
                marginBottom: '1.5rem'
            }
        },
        '& .p-chips': {
            '& .p-inputtext': {
                alignContent: 'flex-start'
            }
        }
    }
});

const notRequired = () => false;

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
    disabled,
    enabled,
    design,
    formApi,
    value,
    submit,
    move,
    toolbar,
    inspected,
    onInspect,
    onFieldChange,
    isPropertyRequired = notRequired,
    classNames
}) => {
    const classes = useStyles();
    const {ut} = useTheme<Theme>();
    const counter = React.useRef(0);
    const api = React.useMemo(() => ({
        index: layoutState.index,
        visibleProperties: layoutState.visibleProperties,
        dropdowns,
        loading,
        methods,
        submit,
        counter,
        formApi,
        onFieldChange,
        value,
        isPropertyRequired
    }), [
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
    if (typeof cardName === 'object') cardName = cardName.name;
    const allow = useAllow(cards[cardName], formApi, {disabled, enabled});

    const InputWrap = React.useCallback(function InputWrap(props) {
        return <Input {...props} {...allow(props)} api={api} />;
    }, [api, allow]);

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
            ? <label className={clsx('col-12', className, isRequired && ut?.classes?.labelRequired)} htmlFor={name.replace(/\./g, '-')}><Text>{label}</Text></label>
            : null;
    }, [layoutState.index, ut?.classes?.labelRequired]);

    const formErrors = Object.keys(formApi?.formState?.errors || {}).length && formApi?.formState?.errors;
    const ErrorLabel = React.useCallback(({name, className = 'md:col-4'}) => {
        const error = formErrors && get(formErrors, name);
        return error
            ? error.message && <><small className={clsx('col-12', className)}/><small className='col p-error'><Text>{error.message}</Text></small></>
            : null;
    }, [formErrors]);

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
            widget: widgetClass = (typeof property === 'function') ? 'grid' : 'field grid',
            label: labelClass
        } = {...init, ...classes?.default, ...classes?.[propertyName]};
        function Field() {
            if (typeof property === 'function') {
                return property({
                    name,
                    propertyName,
                    Input: name.startsWith('$.edit.') ? InputWrapEdit : InputWrap,
                    Label,
                    ErrorLabel,
                    widget,
                    api,
                    ...allow(widget)
                });
            }
            return (
                <Input
                    Label={Label}
                    ErrorLabel={ErrorLabel}
                    propertyName={propertyName}
                    parent={parent}
                    name=''
                    classes={classes}
                    labelClass={labelClass}
                    {...widget as object}
                    {...allow(widget)}
                    api={api}
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

    const {label, widgets = [], flex, hidden, classes: cardClasses, type, permission} = (cards[cardName] || {label: '❌ ' + cardName});
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
            permission={design || permission}
        >
            {widgets.length > 0 && <div className={clsx(flex && 'flex flex-wrap', cardClasses?.default?.root)}>
                {widgets.map(field(widgets.length, flex, cardName, cardClasses, classNames))}
            </div>}
        </ConfigCard>
    );
};

export default Card;
