import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import get from 'lodash.get';
import clonedeep from 'lodash.clonedeep';
import { joiResolver } from '@hookform/resolvers/joi';
import { DevTool } from '@hookform/devtools';
import {createUseStyles} from 'react-jss';

import { ComponentProps } from './Form.types';
import { ConfigCard} from './DragDrop';
import Context from '../Context';
import Card from '../Card';

import useForm from '../hooks/useForm';
import useSubmit from '../hooks/useSubmit';
import useResetPassword from '../hooks/useResetPassword';
import useLayout from '../hooks/useLayout';
import getValidation from './schema';

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
    debug,
    cards,
    layout,
    loading,
    methods,
    onSubmit,
    inspected,
    onInspect,
    onChange,
    setTrigger,
    triggerNotDirty,
    autoSubmit,
    toolbarRef,
    toolbar = 'toolbar',
    value,
    dropdowns,
    validation,
    shouldResetPassword,
    setResetPassword,
    ...rest
}) => {
    const classes = useStyles();
    // console.log(joiSchema.describe());
    const resolver = React.useMemo(
        () => joiResolver(validation || getValidation(schema), {stripUnknown: true, abortEarly: false}),
        [validation, schema]
    );
    const formApi = useForm({resolver});
    const {
        handleSubmit: formSubmit,
        control,
        reset,
        formState: {
            errors,
            isDirty,
            isSubmitting
        },
        watch,
        setError,
        clearErrors
    } = formApi;
    const errorFields = flat(errors);
    const layoutState = useLayout(schema, cards, layout, editors);

    const {handleSubmit, toast} = useSubmit(
        async form => {
            try {
                clearErrors();
                return await onSubmit([form, layoutState.index]);
            } catch (error) {
                if (!Array.isArray(error.validation)) throw error;
                error.validation.forEach(({path = [], message = ''} = {}) => {
                    if (path && message) {
                        if (Array.isArray(path)) {
                            if (path[0] === 'params') setError(path.slice(1).join('.'), {message});
                        } else setError(path, {message});
                    }
                });
            }
        },
        [onSubmit, setError, clearErrors, layoutState.index]
    );

    const canSetTrigger = (isDirty || triggerNotDirty) && !isSubmitting;
    React.useEffect(() => {
        if (setTrigger) setTrigger(canSetTrigger ? () => formSubmit(handleSubmit) : undefined);
    }, [setTrigger, formSubmit, handleSubmit, isDirty, canSetTrigger]);

    const { handleResetPassword } = useResetPassword(
        async form => {
            try {
                clearErrors();
                onSubmit([{ ...form, resetPassword: true }, layoutState.index]);
            } catch (error) {
                if (!Array.isArray(error.validation)) throw error;
                error.validation.forEach(({ path = [], message = '' } = {}) => {
                    if (path && message) {
                        if (Array.isArray(path)) {
                            if (path[0] === 'params') setError(path.slice(1).join('.'), { message });
                        } else setError(path, { message });
                    }
                });
            }
        },
        [onSubmit, setError, clearErrors, layoutState.index]
    );

    const canResetPassword = shouldResetPassword && setResetPassword;
    React.useEffect(() => {
        if (canResetPassword) setResetPassword(() => formSubmit(handleResetPassword));
    }, [canResetPassword, setResetPassword, formSubmit, handleResetPassword]);

    React.useEffect(() => {
        const {$original, ...formValue} = value || {};
        reset({...formValue, $original: clonedeep(formValue)});
        if (watch && onChange) {
            const watcher = watch(value => onChange(JSON.parse(JSON.stringify(value))));
            return () => watcher.unsubscribe();
        }
    }, [value, reset, loading, watch, onChange]);

    const {devTool} = React.useContext(Context);
    let toolbarElement = null;
    if (toolbarRef?.current && cards[toolbar]?.widgets?.length) {
        toolbarElement = ReactDOM.createPortal(<Card
            cardName={toolbar}
            cards={cards}
            layoutState={layoutState}
            dropdowns={dropdowns}
            design={design}
            loading={loading}
            formApi={formApi}
            methods={methods}
            move={move}
            toolbar
        />, toolbarRef.current);
    }

    return (<>
        {devTool ? <DevTool control={control} placement="top-right" /> : null}
        {toast}
        {toolbarElement}
        <form {...rest} onSubmit={formSubmit(handleSubmit)} className={clsx('grid col align-self-start', classes.form, className)}>
            {
                !!Object.keys(errors).length && <div className='col-12'>
                    {errorFields.map(name => !layoutState.visibleProperties.includes(name) && <><small className="p-error">{get(errors, name)?.message}</small><br /></>)}
                </div>
            }
            {layoutState.visibleCards.map((id1, level1) => {
                const nested = [].concat(id1);
                const firstCard = cards[widgetName(nested[0])];
                const nestedCards = nested.map((widget, level2) => {
                    const key = widgetName(widget);
                    const currentCard = cards?.[key];
                    if (currentCard?.hidden && !design) return null;
                    const watched = currentCard?.watch && watch(currentCard.watch);
                    const match = currentCard?.match;
                    return (!match || (typeof match === 'object' ? Object.entries(match).every(([key, value]) => watched?.[key] === value) : match === watched))
                        ? <Card
                                key={`${level1}-${Array.isArray(id1) && level2}`}
                                cardName={widget}
                                index1={level1}
                                index2={Array.isArray(id1) && level2}
                                cards={cards}
                                layoutState={layoutState}
                                dropdowns={dropdowns}
                                design={design}
                                loading={loading}
                                formApi={formApi}
                                methods={methods}
                                move={move}
                                inspected={inspected}
                                onInspect={onInspect}
                        />
                        : null;
                }).filter(Boolean);

                if (!nestedCards.length) return null;
                return (
                    <div key={level1} className={clsx('col-12', firstCard?.className || (!firstCard?.hidden && 'xl:col-6'))} {...(design || debug) && {style: outline}}>
                        {nestedCards}
                        <ConfigCard
                            title='&nbsp;'
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
                    title='&nbsp;'
                    className='card mb-3'
                    card=''
                    key={`${layoutState.visibleCards.length}-drop`}
                    index1={layoutState.visibleCards.length}
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
