import React from 'react';
import clsx from 'clsx';
import get from 'lodash.get';
import { joiResolver } from '@hookform/resolvers/joi';

import { Styled, StyledType } from './Form.types';
import { DDField, DDCard} from './DragDrop';
import input from './input';

import { Properties, Editors, PropertyEditors } from '../types';
import useForm from '../hooks/useForm';
import useToggle from '../hooks/useToggle';
import Controller from '../Controller';
import getSchema from './schema';

const getIndex = (properties: Properties, editors: Editors, root: string) : PropertyEditors => Object.entries(properties).reduce(
    (map, [name, property]) => {
        return ('properties' in property) ? {
            ...map,
            ...getIndex(property.properties, {}, name + '.')
        } : {
            ...map,
            [root + name]: property
        };
    },
    {...editors}
);

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
    const index = getIndex(properties, editors, '');
    const {handleSubmit, control, reset, formState: {errors, isDirty}, watch, setValue} = useForm({resolver: joiResolver(joiSchema)});
    const getFormErrorMessage = (name) => {
        const error = get(errors, name);
        return error && <small className="p-error">{error.message}</small>;
    };
    React.useEffect(() => {
        if (setTrigger) setTrigger(isDirty ? prev => handleSubmit(onSubmit) : undefined);
    }, [setTrigger, handleSubmit, onSubmit, isDirty]);
    React.useEffect(() => {
        reset(value || {});
    }, [value, reset]);

    const children: {[parent: string]: string[]} = {};

    function addParent(properties: PropertyEditors, name: string) {
        const parent = properties[name]?.editor?.parent;
        if (parent) {
            const items = children[parent];
            if (items) items.push(name);
            else children[parent] = [name];
            return watch(parent);
        }
    }

    const parentChange = (name : string) => {
        const items = children[name];
        if (items) items.forEach(child => setValue(child, null));
    };

    const [, moved] = useToggle();

    function move(type: 'card' | 'field', source, destination) {
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
    }

    function card(id: string, index1, index2) {
        const {title, properties = [], flex, hidden, classes} = (cards[id] || {title: '❌ ' + id});
        return (
            <DDCard title={title} key={String(index2)} className='card mb-3' card={id} id={id} index={[index1, index2]} move={move} flex={flex} design={design} hidden={hidden}>
                <div className={clsx(flex && 'flex flex-wrap')}>
                    {properties.map((name, ind) => {
                        const property = index[name];
                        const Component = property && ('Component' in property) && property.Component;
                        const {
                            field: fieldClass = Component ? 'grid' : 'field grid',
                            label: labelClass
                        } = {...classes?.default, ...classes?.[name]};
                        const inputClass = (name, className) => ({
                            ...classes?.default,
                            ...classes?.[name]
                        }.input || ((index[name]?.title || className) ? `col-12 ${className}` : 'col-12'));
                        const Input = ({name, className}) => <Controller
                            control={control}
                            name={name}
                            render={
                                ({field}) => <div className={inputClass(name, className)}>{input(
                                    {
                                        className: clsx('w-full', { 'p-invalid': errors[name] }),
                                        ...field,
                                        onChange: e => {
                                            try {
                                                parentChange(name);
                                            } finally {
                                                field.onChange(e);
                                            }
                                        }
                                    },
                                    {id: name, ...index[name]?.editor},
                                    index[name],
                                    dropdowns,
                                    addParent(index, name),
                                    loading
                                )}</div>
                            }
                        />;
                        return property ? <DDField
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
                            {Component ? <Component
                                control = {control}
                                name = {name}
                                dropdowns = {dropdowns}
                                filter = {addParent(index, name)}
                                loading = {loading}
                                Input = {Input}
                            /> : <Input name={name} className='md:col-8' />}
                            {getFormErrorMessage(name)}
                        </DDField> : <div className="field grid" key={name}>❌ {name}</div>;
                    })}
                </div>
            </DDCard>
        );
    }
    const visibleCards: (string | string[])[] = (layout || Object.keys(cards));
    const errorFields = flat(errors).flat();
    const visibleProperties = visibleCards.map(id => {
        const nested = [].concat(id);
        return nested.map(cardName => cards[cardName]?.properties);
    }).flat(10).filter(Boolean);

    return (
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
                        <DDCard
                            title='[ add row ]'
                            className='card mb-3'
                            card=''
                            index={[level1, nested.length]}
                            move={move}
                            design={design}
                            drop
                        />
                    </div>
                );
            })}
            {design && <div className='col-12 xl:col-6' style={outline}>
                <DDCard
                    title='[ add column ]'
                    className='card mb-3'
                    card=''
                    index={[visibleCards.length, false]}
                    move={move}
                    design={design}
                    drop
                />
            </div>}
        </form>
    );
};

export default Styled(Form);
