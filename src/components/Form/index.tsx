import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import get from 'lodash.get';
import clonedeep from 'lodash.clonedeep';
import { DevTool } from '@hookform/devtools';
import {createUseStyles} from 'react-jss';

import { ComponentProps } from './Form.types';
import { ConfigCard} from './DragDrop';
import Context from '../Context';
import Card from '../Card';
import type {UtError} from '../types';

import useLayout from '../hooks/useLayout';
import { usePermissionCheck } from '../hooks';

const useStyles = createUseStyles({
    form: {
        '& .p-datatable-wrapper': {
            overflowX: 'auto'
        }
    }
});

const widgetName = name => typeof name === 'string' ? name : name.name;

interface Errors {
    message?: string
}

const flat = (e: Errors, path = '') => Object.entries(e).map(
    ([name, value]) => typeof value.message === 'string' ? (path ? path + '.' + name : name) : flat(value, path ? path + '.' + name : name)
).flat();

const outline = {outline: '1px dotted #ffff0030'};

const Form: ComponentProps = ({
    move,
    className,
    schema = {},
    editors,
    design,
    designCards,
    debug,
    cards,
    layout,
    layoutFields,
    loading,
    disabled,
    enabled,
    methods,
    onSubmit,
    inspected,
    onInspect,
    onChange,
    onFieldChange,
    setTrigger,
    triggerNotDirty,
    autoSubmit,
    toolbarRef,
    toolbar = 'toolbar',
    value,
    dropdowns,
    validation,
    formApi,
    isPropertyRequired,
    ...rest
}) => {
    const classes = useStyles();
    const {
        handleSubmit: formSubmit,
        control,
        reset,
        formState: {
            errors,
            isDirty,
            isSubmitting,
            dirtyFields
        },
        watch,
        setError,
        clearErrors
    } = formApi;
    const errorFields = flat(errors);
    const layoutState = useLayout(schema, cards, layout, editors, undefined, layoutFields);

    const handleSubmit = React.useCallback(
        async(event, form) => {
            try {
                clearErrors();
                return await onSubmit([form, layoutState.index, event]);
            } catch (error) {
                if (Array.isArray(error?.validation)) {
                    error.validation.forEach(({path = [], message = ''} = {}) => {
                        if (path && message) {
                            if (Array.isArray(path)) {
                                if (path[0] === 'params') setError(path.slice(1).join('.'), {message});
                            } else setError(path, {message});
                        }
                    });
                    error.silent = !error.print;
                }
                throw error;
            }
        },
        [onSubmit, setError, clearErrors, layoutState.index]
    );

    const submit = React.useMemo(() => formSubmit(
        (form, event) => handleSubmit(event, form),
        (errors, event) => {
            const error: UtError = new Error('validation error');
            // todo: decide about error.print
            error.silent = !error.print;
            error.errors = errors;
            throw error;
        }), [formSubmit, handleSubmit]);

    const canSetTrigger = ((dirtyFields && Object.keys(dirtyFields).length > 0) || triggerNotDirty) && !isSubmitting;

    React.useEffect(() => {
        if (setTrigger) setTrigger(canSetTrigger ? () => submit : undefined);
    }, [setTrigger, submit, isDirty, canSetTrigger]);

    React.useEffect(() => {
        const {$original, ...formValue} = value || {};
        reset({...formValue, $original: clonedeep(formValue)});
        if (watch && onChange) {
            const watcher = watch(value => onChange(JSON.parse(JSON.stringify(value))));
            return () => watcher.unsubscribe();
        }
    }, [value, reset, watch, onChange]);

    const {devTool} = React.useContext(Context);
    let toolbarElement = null;
    if (toolbarRef?.current && cards[toolbar]?.widgets?.length) {
        toolbarElement = ReactDOM.createPortal(<Card
            key='toolbar'
            cardName={toolbar}
            cards={cards}
            layoutState={layoutState}
            dropdowns={dropdowns}
            design={design}
            loading={loading}
            disabled={disabled}
            enabled={enabled}
            formApi={formApi}
            methods={methods}
            move={move}
            submit={submit}
            inspected={inspected}
            onInspect={onInspect}
            onFieldChange={onFieldChange}
            toolbar
        />, toolbarRef.current);
    }

    const errorList =
        !!Object.keys(errors).length &&
        errorFields
            .map(name => !layoutState.visibleProperties.includes(name) && <><small className="p-error">{get(errors, name)?.message}</small><br /></>)
            .filter(Boolean);

    const permissionCheck = usePermissionCheck();

    return (<>
        {devTool ? <DevTool control={control} placement="top-right" /> : null}
        {toolbarElement}
        <div {...rest} className={clsx('grid col align-self-start', classes.form, className)}>
            {!!errorList.length && <div className='col-12'>{errorList}</div>}
            {layoutState.visibleCards.map((id1, level1) => {
                const nested = [].concat(id1).filter(widget => {
                    const key = widgetName(widget);
                    if (!key) return true;
                    const currentCard = cards?.[key];
                    if (currentCard?.hidden && !design) return null;
                    const watched = currentCard?.watch && watch(currentCard.watch);
                    const match = currentCard?.match;
                    return (design || permissionCheck(currentCard?.permission)) && (!match || (typeof match === 'object' ? Object.entries(match).every(([key, value]) => watched?.[key] === value) : match === watched));
                });
                const firstCardName = widgetName(nested[0] || {});
                const firstCard = firstCardName ? cards[firstCardName] : nested[0];
                const nestedCards = nested.map((widget, level2) =>
                    widgetName(widget) && <Card
                        key={`${level1}-${Array.isArray(id1) && level2}`}
                        cardName={widget}
                        index1={level1}
                        last1={layoutState.visibleCards.length - 1}
                        index2={Array.isArray(id1) && level2}
                        last2={Array.isArray(id1) && nested.length - 1}
                        cards={cards}
                        layoutState={layoutState}
                        dropdowns={dropdowns}
                        design={design}
                        loading={loading}
                        disabled={disabled}
                        enabled={enabled}
                        formApi={formApi}
                        methods={methods}
                        submit={submit}
                        move={move}
                        inspected={inspected}
                        onInspect={onInspect}
                        onFieldChange={onFieldChange}
                        isPropertyRequired={isPropertyRequired}
                    />
                );

                if (!nestedCards.length) return null;
                return (
                    <div key={level1} className={clsx('col-12', firstCard?.className || (!firstCard?.hidden && 'xl:col-6'))} {...(design || debug) && {style: outline}}>
                        {nestedCards}
                        <ConfigCard
                            title='&nbsp;'
                            className='card mt-3'
                            card=''
                            key={`${level1}-drop`}
                            index1={level1}
                            index2={nested.length}
                            move={move}
                            design={designCards}
                            drop
                        />
                    </div>
                );
            })}
            {designCards && <div className='col-12 xl:col-6' style={outline}>
                <ConfigCard
                    title='&nbsp;'
                    className='card'
                    card=''
                    key={`${layoutState.visibleCards.length}-drop`}
                    index1={layoutState.visibleCards.length}
                    index2={false}
                    move={move}
                    design={design}
                    drop
                />
            </div>}
        </div>
    </>);
};

export default Form;
