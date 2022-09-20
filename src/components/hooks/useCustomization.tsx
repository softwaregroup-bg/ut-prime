import React from 'react';
import merge from 'ut-function.merge';
import clsx from 'clsx';

import useToggle from './useToggle';

import SelectField from '../Editor/SelectField';
import SelectCard from '../Editor/SelectCard';
import Inspector from '../Inspector';
import ThumbIndex from '../ThumbIndex';
import Context from '../Context';
import {ConfigField, ConfigCard} from '../Form/DragDrop';
import {Button} from '../prime';
import Permission from '../Permission';
import testid from '../lib/testid';
import type {Cards, Layouts} from '../types';

const capital = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

function getLayout(cards: Cards, layouts: Layouts, mode: 'create' | 'edit', name = '') {
    let layoutName = mode + capital(name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items: any = layouts?.[layoutName];
    if (!items && mode !== 'edit' && !cards[layoutName]) {
        layoutName = 'edit' + capital(name);
        items = layouts?.[layoutName];
    }
    let layout: string[];
    const orientation = items?.orientation;
    if (orientation) items = items.items;
    if (typeof (items?.[0]?.[0] || items?.[0]) === 'string') {
        layout = items;
        items = false;
    } else layout = !items && [layoutName];
    let toolbar = `toolbar${capital(mode)}${capital(name)}`;
    if (!cards[toolbar]) toolbar = `toolbar${capital(name)}`;
    if (!cards[toolbar]) toolbar = `toolbar${capital(mode)}`;
    if (!cards[toolbar]) toolbar = 'toolbar';
    return [items, layout, orientation || 'left', toolbar, layoutName];
}

export default function useCustomization(
    designDefault,
    schema,
    cards,
    layouts,
    customizationDefault,
    mode,
    layoutState,
    Editor,
    maxHeight,
    onCustomization,
    methods,
    name,
    loading
) {
    const [inspected, onInspect] = React.useState(null);
    const {customization: customizationEnabled} = React.useContext(Context);
    const [design, toggleDesign] = useToggle(designDefault);
    const [mergedCustomization, setCustomization] = React.useState({schema: {}, card: {}, layout: {}, ...customizationDefault});
    const mergedSchema = React.useMemo(() => merge({}, schema, mergedCustomization.schema), [schema, mergedCustomization.schema]);
    const mergedCards = React.useMemo(() => merge({}, cards, mergedCustomization.card), [cards, mergedCustomization.card]);
    const mergedLayouts = React.useMemo(() => merge({}, layouts, mergedCustomization.layout), [layouts, mergedCustomization.layout]);
    const [addField, setAddField] = React.useState(null);
    const [addCard, setAddCard] = React.useState(null);
    const [items, layout, orientation, toolbar, currentLayoutName] = React.useMemo(
        () => getLayout(mergedCards, mergedLayouts, mode, layoutState),
        [mergedCards, mergedLayouts, mode, layoutState]
    );

    const move = React.useCallback((type: 'card' | 'field', source, destination) => {
        if (type === 'field') {
            if (source.card === '/') {
                setAddField({destination});
            } else {
                setCustomization(prev => {
                    const destinationList = [...prev.card[destination.card]?.widgets || cards[destination.card].widgets];
                    const sourceList = (source.card === destination.card)
                        ? destinationList
                        : [...prev.card[source.card]?.widgets || cards[source.card].widgets];
                    destinationList.splice(destination.index, 0, sourceList.splice(source.index, 1)[0]);
                    return {
                        ...prev,
                        card: {
                            ...prev.card,
                            [source.card]: {
                                ...prev.card[source.card],
                                widgets: sourceList
                            },
                            [destination.card]: {
                                ...prev.card[destination.card],
                                widgets: destinationList
                            }
                        }
                    };
                });
            }
        } else if (type === 'card') {
            const newLayout = layout.map(item => Array.isArray(item) ? [...item] : item);
            let [
                destinationList,
                destinationIndex
            ] = (destination.index[1] === false) ? [
                newLayout,
                destination.index[0]
            ] : [
                newLayout[destination.index[0]],
                destination.index[1]
            ];
            if (!Array.isArray(destinationList)) {
                const card = newLayout[destination.index[0]];
                if (typeof card === 'string') destinationList = newLayout[destination.index[0]] = [card];
            }
            if (source.index[0] === false && Array.isArray(destinationList)) {
                setAddCard({destinationList, destinationIndex, newLayout, currentLayoutName});
                return;
            }
            const [
                sourceList,
                sourceIndex,
                sourceNested
            ] = (source.index[1] === false) ? [
                newLayout,
                source.index[0],
                false
            ] : [
                newLayout[source.index[0]],
                source.index[1],
                true
            ];
            if (Array.isArray(sourceList) && Array.isArray(destinationList)) {
                setCustomization(prev => {
                    const removed = sourceList.splice(sourceIndex, 1)[0];
                    if (sourceList.length === 1 && sourceNested && sourceList !== destinationList) newLayout[source.index[0]] = sourceList[0];
                    destinationList.splice(destinationIndex, 0, removed);
                    return {
                        ...prev,
                        layout: {
                            ...prev.layout,
                            [currentLayoutName]: newLayout
                        }
                    };
                });
            }
        }
    }, [cards, layout, currentLayoutName]);

    const remove = React.useCallback((type, source) => {
        if (type === 'card') {
            const newLayout = layout.map(item => Array.isArray(item) ? [...item] : item);
            const [
                sourceList,
                sourceIndex,
                sourceNested
            ] = (source.index[1] === false) ? [
                newLayout,
                source.index[0],
                false
            ] : [
                newLayout[source.index[0]],
                source.index[1],
                true
            ];
            if (Array.isArray(sourceList)) {
                setCustomization(prev => {
                    sourceList.splice(sourceIndex, 1);
                    if (sourceList.length === 1 && sourceNested) newLayout[source.index[0]] = sourceList[0];
                    return {
                        ...prev,
                        layout: {
                            ...prev.layout,
                            [currentLayoutName]: newLayout
                        }
                    };
                });
            }
        } else if (type === 'field') {
            if (source.card !== '/') {
                const sourceList = mergedCards[source.card].widgets;
                sourceList.splice(source.index, 1);
                setCustomization(prev => {
                    return {
                        ...prev,
                        card: {
                            ...prev.card,
                            [source.card]: {
                                ...prev.card[source.card],
                                widgets: sourceList
                            }
                        }
                    };
                });
            }
        }
    }, [layout, currentLayoutName, mergedCards]);

    const selectField = design ? <SelectField
        schema={mergedSchema}
        visible={!!addField}
        onHide={() => setAddField(null)}
        onSelect={items => {
            const {destination} = addField;
            setCustomization(prev => {
                const destinationList = [...prev.card[destination.card]?.widgets || cards[destination.card].widgets];
                destinationList.splice(destination.index, 0, ...items);
                return {
                    ...prev,
                    card: {
                        ...prev.card,
                        [destination.card]: {
                            ...prev.card[destination.card],
                            widgets: destinationList
                        }
                    }
                };
            });
        }}
    /> : null;
    const selectCard = design ? <SelectCard
        cards={mergedCards}
        visible={!!addCard}
        onHide={() => setAddCard(null)}
        onSelect={item => {
            const {destinationList, destinationIndex, newLayout, currentLayoutName} = addCard;
            setCustomization(prev => {
                destinationList.splice(destinationIndex, 0, item);
                return {
                    ...prev,
                    layout: {
                        ...prev.layout,
                        [currentLayoutName]: newLayout
                    }
                };
            });
        }}
    /> : null;

    const inspector = design && <>
        {selectField}
        {selectCard}
        <div style={maxHeight} className={clsx('col-2 flex-column pr-0')}>
            <ConfigField
                index='trash'
                design
                move={remove}
                label='trash'
                name='trash'
                className='text-center p-3 p-card'
            ><i className='pi pi-trash'/></ConfigField>
            {inspected ? <Inspector
                Editor={Editor}
                className={clsx('w-full overflow-y-auto')}
                onChange={setCustomization}
                object={inspected.type === 'card' ? mergedCards : mergedSchema}
                property={inspected.type === 'card' ? inspected.name : `properties.${inspected.name.split('.').join('.properties.')}`}
                type={inspected.type}
            /> : null }
        </div>
    </>;

    const handleCustomization = React.useCallback(
        function handleCustomization(event) {
            (onCustomization || methods['portal.customization.edit'])({component: {componentId: name, componentConfig: mergedCustomization}});
        },
        [onCustomization, methods, mergedCustomization, name]
    );

    const customizationToolbar = <>
        {design ? <>
            {(onCustomization || methods) ? <Button
                icon='pi pi-save'
                onClick={handleCustomization}
                aria-label='save customization'
                className='mr-2'
                {...testid(name ? name + 'CustomizationSave' : 'customizationSave')}
            /> : null}
            <ConfigCard
                className='mr-2'
                title='[ add card ]'
                card=''
                index1={false}
                index2={false}
                design
                drag
            >
                <Button icon='pi pi-id-card' className='cursor-move'/>
            </ConfigCard>
            <ConfigField
                className='flex mr-2'
                index={name}
                name={name}
                card='/'
                design
                label='[add field]'
            >
                <Button icon='pi pi-pencil'/>
            </ConfigField>
        </> : null}
        {customizationEnabled ? <Permission permission='portal.customization.edit'>
            <Button
                icon='pi pi-cog'
                onClick={toggleDesign}
                disabled={!!loading}
                aria-label='design'
                {...testid(name ? name + 'Customization' : 'customization')}
                className={clsx(design && 'p-button-success')}
            /></Permission> : null}
    </>;

    const loadCustomization = async() => {
        const customizationResult = await (customizationEnabled && methods && !customizationDefault && methods['portal.customization.get']({componentId: name}));
        customizationResult?.component && setCustomization({schema: {}, card: {}, layout: {}, ...(customizationResult.component as {componentConfig?:object}).componentConfig});
    };

    const [filter, setFilter] = React.useState(items?.[0]?.items?.[0] || items?.[0]);
    const thumbIndex = items && <ThumbIndex name={name} items={items} orientation={orientation} onFilter={setFilter}/>;

    return [
        customizationToolbar,
        mergedSchema,
        mergedCards,
        inspector,
        loadCustomization,
        items,
        orientation,
        thumbIndex,
        layout || filter?.widgets,
        React.useMemo(() => ({move, inspected, onInspect, toolbar, design}), [move, inspected, onInspect, toolbar, design])
    ];
}
