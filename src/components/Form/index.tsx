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

import SelectField from './SelectField';
import SelectCard from './SelectCard';
import useForm from '../hooks/useForm';
import useNow from '../hooks/useNow';
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
            isDirty
        },
        watch,
        setError,
        clearErrors
    } = formApi;
    React.useEffect(() => {
        if (watch && onChange) {
            const watcher = watch(onChange);
            return () => watcher.unsubscribe();
        }
    }, [onChange, watch]);
    const errorFields = flat(errors);
    const moved = useNow();
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

    const canSetTrigger = isDirty || triggerNotDirty;
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
    }, [value, reset]);

    const [addField, setAddField] = React.useState(null);
    const [addCard, setAddCard] = React.useState(null);

    const move = React.useCallback((type: 'card' | 'field', source, destination) => {
        if (type === 'field') {
            const destinationList = cards[destination.card].widgets;
            if (source.card === '/') {
                setAddField({destination, destinationList});
            } else {
                const sourceList = cards[source.card].widgets;
                destinationList.splice(destination.index, 0, sourceList.splice(source.index, 1)[0]);
            }
        } else if (type === 'card') {
            let [
                destinationList,
                destinationIndex
            ] = (destination.index[1] === false) ? [
                layoutState.visibleCards,
                destination.index[0]
            ] : [
                layoutState.visibleCards[destination.index[0]],
                destination.index[1]
            ];
            if (!Array.isArray(destinationList)) {
                const card = layoutState.visibleCards[destination.index[0]];
                if (typeof card === 'string') destinationList = layoutState.visibleCards[destination.index[0]] = [card];
            }
            if (source.index[0] === false && Array.isArray(destinationList)) {
                setAddCard({destinationList, destinationIndex});
                return;
            }
            const [
                sourceList,
                sourceIndex,
                sourceNested
            ] = (source.index[1] === false) ? [
                layoutState.visibleCards,
                source.index[0],
                false
            ] : [
                layoutState.visibleCards[source.index[0]],
                source.index[1],
                true
            ];
            if (Array.isArray(sourceList) && Array.isArray(destinationList)) {
                const removed = sourceList.splice(sourceIndex, 1)[0];
                if (sourceList.length === 1 && sourceNested && sourceList !== destinationList) layoutState.visibleCards[source.index[0]] = sourceList[0];
                destinationList.splice(destinationIndex, 0, removed);
            }
        }
        moved();
    }, [cards, moved, layoutState.visibleCards]);

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
        {design ? <SelectField
            schema={schema}
            visible={!!addField}
            onHide={() => setAddField(null)}
            onSelect={items => {
                const {destination, destinationList} = addField;
                destinationList.splice(destination.index, 0, ...items);
                moved();
            }}
        /> : null }
        {design ? <SelectCard
            cards={cards}
            visible={!!addCard}
            onHide={() => setAddCard(null)}
            onSelect={item => {
                const {destinationList, destinationIndex} = addCard;
                destinationList.splice(destinationIndex, 0, item);
                moved();
            }}
        /> : null }
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
