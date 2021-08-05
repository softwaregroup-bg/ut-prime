import React from 'react';
import clsx from 'clsx';
import Joi from 'joi';
import get from 'lodash.get';
import { joiResolver } from '@hookform/resolvers/joi';

import { Styled, StyledType } from './Form.types';
import { DDField, DDCard} from './DragDrop';
import input from './input';

import { Properties } from '../types';
import useForm from '../hooks/useForm';
import useToggle from '../hooks/useToggle';
import Controller from '../Controller';

const getSchema = (properties: Properties) : Joi.Schema => Object.entries(properties).reduce(
    (schema, [name, field]) => {
        if ('properties' in field) {
            return schema.append({[name]: getSchema(field.properties)});
        } else {
            const {title, validation = Joi.string().min(0).allow('', null)} = field;
            return schema.append({[name]: validation.label(title || name)});
        }
    },
    Joi.object()
);

const getIndex = (properties: Properties, root: string) : Properties => Object.entries(properties).reduce(
    (map, [name, property]) => {
        return ('properties' in property) ? {
            ...map,
            ...getIndex(property.properties, name + '.')
        } : {
            ...map,
            [root + name]: property
        };
    },
    {}
);

interface Errors {
    message?: string
}

const flat = (e: Errors, path = '') => Object.entries(e).map(
    ([name, value]) => typeof value.message === 'string' ? (path ? path + '.' + name : name) : flat(value, name)
);

const outline = {outline: '1px dotted #ffff0030'};

const Form: StyledType = ({ classes, className, properties, design, cards, layout, onSubmit, setTrigger, value, dropdowns, validation, ...rest }) => {
    const joiSchema = validation || getSchema(properties);
    const index = getIndex(properties, '');
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
    }, [value]);

    const children: {[parent: string]: string[]} = {};

    function addParent(properties: Properties, name: string) {
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
        const {title, properties = [], flex} = (cards[id] || {title: '❌ ' + id});
        return (
            <DDCard title={title} key={String(index2)} className='p-fluid p-mb-3' card={id} index={[index1, index2]} move={move} flex={flex} design={design}>
                <div className={clsx(flex && 'p-d-flex p-flex-wrap')}>
                    {properties.map((name, ind) => index[name] ? <DDField
                        className={clsx('p-field p-grid', flex)}
                        key={name}
                        index={ind}
                        card={id}
                        move={move}
                        design={design}
                        label={index[name].title}
                    >
                        <div className={clsx(index[name].title ? 'p-col-12 p-md-8' : 'p-col-12')}>
                            <Controller
                                control={control}
                                name={name}
                                render={
                                    ({field}) => input(
                                        {
                                            className: clsx({ 'p-invalid': errors[name] }),
                                            ...field,
                                            onChange: e => {
                                                try {
                                                    parentChange(name);
                                                } finally {
                                                    field.onChange(e);
                                                }
                                            }
                                        },
                                        index[name].editor,
                                        index[name],
                                        dropdowns,
                                        addParent(index, name)
                                    )
                                }
                            />
                        </div>
                        {getFormErrorMessage(name)}
                    </DDField> : <div className="p-field p-grid" key={name}>❌ {name}</div>
                    )}
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
        <form {...rest} onSubmit={handleSubmit(onSubmit)} className={clsx('p-grid p-col', className)}>
            {
                !!Object.keys(errors).length && <div className='p-col-12'>
                    {errorFields.map(name => !visibleProperties.includes(name) && <><small className="p-error">{get(errors, name)?.message}</small><br /></>)}
                </div>
            }
            {visibleCards.map((id1, level1) => {
                const nested = [].concat(id1);
                const key = nested[0];
                return (
                    <div key={level1} className={clsx('p-col-12', cards[key]?.className || 'p-xl-6')} {...design && {style: outline}}>
                        {nested.map((id2, level2) => card(id2, level1, Array.isArray(id1) && level2))}
                        <DDCard
                            title='[ add row ]'
                            className='p-fluid p-mb-3'
                            card=''
                            index={[level1, nested.length]}
                            move={move}
                            design={design}
                            drop
                        />
                    </div>
                );
            })}
            {design && <div className='p-col-12 p-xl-6' style={outline}>
                <DDCard
                    title='[ add column ]'
                    className='p-fluid p-mb-3'
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
