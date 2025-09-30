import React from 'react';
import merge from 'ut-function.merge';
import clsx from 'clsx';
import {get as lodashGet, set as lodashSet} from 'lodash-es';
import { joiResolver } from '@hookform/resolvers/joi';
import getValidation from '../Form/schema';
import fieldNames from '../lib/fields';

import useToggle from './useToggle';

import SelectField from '../Inspector/SelectField';
import SelectCard from '../Inspector/SelectCard';
import Inspector from '../Inspector';
import ThumbIndex from '../ThumbIndex';
import Context from '../Context';
import TextContext from '../Text/context';
import {ConfigField, ConfigCard, useDragging} from '../Form/DragDrop';
import {Button} from '../prime';
import testid from '../lib/testid';
import useForm from '../hooks/useForm';
import useLayout from '../hooks/useLayout';
import type {Cards, Layouts, LayoutMode} from '../types';

const capital = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

function getLayout(cards: Cards, layouts: Layouts, mode: LayoutMode, name = '', permissionCheck) {
    let layoutName = mode + capital(name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items: any = layouts?.[layoutName];
    if (!items && mode !== 'edit' && !cards[layoutName]) {
        layoutName = 'edit' + capital(name);
        items = layouts?.[layoutName];
    }
    let layout: string[];
    const orientation = items?.orientation;
    const type = items?.type;
    const disableBack = items?.disableBack;
    const hideBack = items?.hideBack;
    const disabled = items?.disabled;
    const enabled = items?.enabled;
    if (orientation) items = items.items;
    if (typeof (items?.[0]?.[0] || items?.[0]) === 'string') {
        layout = items;
        items = false;
    } else layout = !items && [layoutName];
    if (items) items = items.filter(({permission}) => !permission || permissionCheck(permission));
    let toolbar = `toolbar${capital(mode)}${capital(name)}`;
    if (!cards[toolbar]) toolbar = `toolbar${capital(name)}`;
    if (!cards[toolbar]) toolbar = `toolbar${capital(mode)}`;
    if (!cards[toolbar]) toolbar = 'toolbar';
    return [
        items,
        layout,
        type,
        orientation || 'left',
        toolbar,
        layoutName,
        disableBack || false,
        hideBack || false,
        disabled,
        enabled
    ];
}

const indexCards = items => items && items.map(item => [item.widgets, item?.items?.map(item => item.widgets)]).flat(2).filter(Boolean);

const getFieldsValue = (fields, value) => {
    const editValue = {};
    fields.forEach(field => {
        const fieldValue = lodashGet(value, field);
        if (fieldValue !== undefined) lodashSet(editValue, field, fieldValue);
    });
    return editValue;
};

const empty = [];

export default function useCustomization({
    designDefault,
    schema,
    cards,
    layouts,
    customization: customizationDefault,
    mode = 'view' as LayoutMode,
    layoutName = '',
    layout = undefined,
    Editor,
    maxHeight = undefined,
    onCustomization,
    methods,
    name,
    loading,
    trigger = undefined,
    editors,
    permissionCheck = (permission: any) => true
}) {
    const [inspected, onInspect] = React.useState(null);
    const {customization: customizationEnabled} = React.useContext(Context);
    const {joiMessages, translate} = React.useContext(TextContext);
    const [design, toggleDesign] = useToggle(designDefault);
    const [mergedCustomization, setCustomization] = React.useState({schema: {}, card: {}, layout: {}, ...customizationDefault});
    const mergedSchema = React.useMemo(() => merge({}, schema, mergedCustomization.schema), [schema, mergedCustomization.schema]);
    const mergedCards = React.useMemo(() => merge({}, cards, mergedCustomization.card), [cards, mergedCustomization.card]);
    const mergedLayouts = React.useMemo(() => merge({}, layouts, mergedCustomization.layout), [layouts, mergedCustomization.layout]);
    const [addField, setAddField] = React.useState(null);
    const [addCard, setAddCard] = React.useState(null);
    const [items, currentLayout, indexType, orientation, toolbar, currentLayoutName, disableBack, hideBack, disabled, enabled] = React.useMemo(
        () => getLayout(mergedCards, mergedLayouts, mode, layoutName, permissionCheck),
        [mergedCards, mergedLayouts, mode, layoutName, permissionCheck]
    );
    const usedLayout = layout || currentLayout;
    const [[filter, filterIndex], setFilter] = React.useState([items?.[0]?.items?.[0] || items?.[0], 0]);
    const first = React.useRef(true);
    React.useEffect(() => {
        if (first.current) {
            first.current = false;
        } else setFilter([items?.[0]?.items?.[0] || items?.[0], 0]);
    }, [items]);
    const moveLayout = usedLayout || filter?.widgets;

    const move = React.useMemo(() => design && ((type: 'card' | 'field', source, destination) => {
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
            const newLayout = moveLayout.map(item => Array.isArray(item) ? [...item] : item);
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
                const removed = sourceList.splice(sourceIndex, 1)[0];
                if (sourceList.length === 1 && sourceNested && sourceList !== destinationList) newLayout[source.index[0]] = sourceList[0];
                destinationList.splice(destinationIndex, 0, removed);
                const updateLayout = usedLayout ? newLayout : {
                    ...mergedLayouts[currentLayoutName],
                    items: mergedLayouts[currentLayoutName]?.items.map((item, index) => index === filterIndex ? {
                        ...item,
                        widgets: newLayout
                    } : item)
                };
                if (!usedLayout) setFilter([updateLayout.items?.[filterIndex], filterIndex]);
                setCustomization(prev => {
                    return {
                        ...prev,
                        layout: {
                            ...prev.layout,
                            [currentLayoutName]: updateLayout
                        }
                    };
                });
            }
        }
    }), [design, cards, usedLayout, moveLayout, currentLayoutName, mergedLayouts, filterIndex]);

    const remove = React.useMemo(() => design && ((type, source) => {
        if (type === 'card') {
            const newLayout = moveLayout.map(item => Array.isArray(item) ? [...item] : item);
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
                    const updateLayout = usedLayout ? newLayout : {
                        ...mergedLayouts[currentLayoutName],
                        items: mergedLayouts[currentLayoutName]?.items.map((item, index) => index === filterIndex ? {
                            ...item,
                            widgets: newLayout
                        } : item)
                    };
                    if (!usedLayout) setFilter([updateLayout.items?.[filterIndex], filterIndex]);
                    return {
                        ...prev,
                        layout: {
                            ...prev.layout,
                            [currentLayoutName]: updateLayout
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
    }), [design, moveLayout, usedLayout, mergedLayouts, currentLayoutName, filterIndex, mergedCards]);

    const selectField = design ? <SelectField
        schema={mergedSchema}
        visible={!!addField}
        onHide={() => setAddField(null)}
        setCustomization={setCustomization}
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
            destinationList.splice(destinationIndex, 0, item);
            const updateLayout = usedLayout ? newLayout : {
                ...mergedLayouts[currentLayoutName],
                items: mergedLayouts[currentLayoutName]?.items.map((item, index) => index === filterIndex ? {
                    ...item,
                    widgets: newLayout
                } : item)
            };
            if (!usedLayout) setFilter([updateLayout.items?.[filterIndex], filterIndex]);
            setCustomization(prev => {
                return {
                    ...prev,
                    layout: {
                        ...prev.layout,
                        [currentLayoutName]: updateLayout
                    }
                };
            });
        }}
    /> : null;

    const dragging = useDragging();

    const inspector = design && <>
        {selectField}
        {selectCard}
        <div style={maxHeight} className={clsx('col-2 flex-column pr-0', maxHeight && 'overflow-y-auto')}>
            <ConfigField
                index='trash'
                design
                move={remove}
                label='trash'
                name='trash'
                className='text-center p-3 p-card'
            ><i className='pi pi-trash'/></ConfigField>
            {(inspected && !dragging) ? <Inspector
                Editor={Editor}
                className={clsx('w-full')}
                onChange={setCustomization}
                object={inspected.type === 'card' ? mergedCards : mergedSchema}
                property={inspected.type === 'card' ? inspected.name : `properties.${inspected.name.split('.').join('.properties.')}`}
                type={inspected.type}
                where={inspected.where}
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
        {customizationEnabled ? <Button
            permission='portal.customization.edit'
            icon='pi pi-cog'
            onClick={toggleDesign}
            disabled={!!loading}
            aria-label='design'
            {...testid(name ? name + 'Customization' : 'customization')}
            className={clsx(design && 'p-button-success')}
        /> : null}
    </>;

    const loadCustomization = React.useMemo(() => async() => {
        const customizationResult = await (customizationEnabled && methods && !customizationDefault && methods['portal.customization.get']({componentId: name}));
        customizationResult?.component && setCustomization({schema: {}, card: {}, layout: {}, ...(customizationResult.component as {componentConfig?:object}).componentConfig});
    }, [customizationDefault, customizationEnabled, methods, name]);

    const layoutItems = items ? false : usedLayout; // preserve memoization
    const [
        validation,
        dropdownNames,
        layoutFields
    ] = React.useMemo(() => {
        const {fields, validation, dropdownNames} = fieldNames(indexCards(items) || layoutItems || [], mergedCards, mergedSchema, editors, translate);
        return [
            validation,
            dropdownNames,
            fields
        ];
    }, [mergedCards, editors, items, layoutItems, mergedSchema, translate]);

    const getLayoutValue = React.useCallback((mode, layoutState, value) => {
        const [items, layout] = getLayout(mergedCards, mergedLayouts, mode, layoutState, permissionCheck);
        const layoutItems = items ? false : layout;
        const {fields} = fieldNames(indexCards(items) || layoutItems || [], mergedCards, mergedSchema, editors, translate);
        return getFieldsValue(fields, value);
    }, [editors, mergedCards, mergedLayouts, mergedSchema, translate, permissionCheck]);

    const [resolver, isPropertyRequired] = React.useMemo(() => {
        const [validationSchema, requiredProperties] = getValidation(mergedSchema, translate);
        return [
            joiResolver(validation || validationSchema, {stripUnknown: true, abortEarly: false, messages: joiMessages}),
            propertyName => requiredProperties.includes(propertyName)
        ];
    }, [validation, mergedSchema, joiMessages, translate]);
    const formApi = useForm({resolver});

    const layoutState = useLayout(mergedSchema, mergedCards, usedLayout || filter?.widgets || empty, editors, undefined, layoutFields);

    const thumbIndex = items && (
        <ThumbIndex
            name={name}
            items={items}
            orientation={orientation}
            type={indexType}
            onFilter={setFilter}
            trigger={trigger}
            loading={loading}
            disableBack={disableBack}
            hideBack={hideBack}
            methods={methods}
            formApi={formApi}
            layoutState={layoutState}
            layoutDisabled={disabled}
        />
    );

    return {
        customizationToolbar,
        mergedSchema,
        mergedCards,
        inspector,
        loadCustomization,
        orientation,
        thumbIndex,
        layout: usedLayout || filter?.widgets,
        disabled,
        enabled,
        formProps: React.useMemo(() => ({
            move,
            inspected,
            onInspect,
            toolbar,
            design,
            designCards: design
        }), [move, inspected, onInspect, toolbar, design]),
        layoutState,
        dropdownNames,
        getLayoutValue,
        layoutFields,
        formApi,
        isPropertyRequired
    };
}
