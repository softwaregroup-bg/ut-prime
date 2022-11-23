import React from 'react';
import lodashGet from 'lodash.get';
import merge from 'ut-function.merge';
import clsx from 'clsx';
import {createUseStyles} from 'react-jss';

import Card from '../Card';
import { Button, DataTable, DataView, Column, Toolbar, Splitter, SplitterPanel } from '../prime';
import ActionButton from '../ActionButton';
import Component from '../Component';
import useToggle from '../hooks/useToggle';
import useSubmit from '../hooks/useSubmit';
import useLayout from '../hooks/useLayout';
import useLoad from '../hooks/useLoad';
import useWindowSize from '../hooks/useWindowSize';
import Editor from '../Editor';
import Form from '../Form';
import fieldNames from '../lib/fields';
import columnProps, {TableFilter} from '../lib/column';
import prepareSubmit from '../lib/prepareSubmit';

import { ComponentProps } from './Explorer.types';
import testid from '../lib/testid';
import useCustomization from '../hooks/useCustomization';

const backgroundNone = {background: 'none'};

const fieldName = column => typeof column === 'string' ? column : column.name;

const useStyles = createUseStyles({
    current: {
        outline: '0.15rem solid var(--primary-color)',
        outlineOffset: '-0.15rem'
    },
    explorer: {
        '& .p-card .p-card-content': {
            padding: 0
        },
        '& .p-datatable-tbody .p-button': {
            maxWidth: '100%',
            width: 'fit-content'
        },
        '& .p-datatable-tbody .p-button .p-button-label': {
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        '& .p-datatable-wrapper': {
            overflowX: 'auto',
            '& .p-button': {
                textAlign: 'inherit'
            }
        },
        '& .p-datatable-scrollable .p-datatable-thead>tr>th': {
            minWidth: '3rem',
            position: 'relative',
            flexDirection: 'column',
            alignItems: 'unset',
            justifyContent: 'space-evenly'
        },
        '& .p-datatable-scrollable .p-datatable-tbody>tr>td': {
            minWidth: '3rem',
            flexDirection: 'column',
            alignItems: 'unset',
            justifyContent: 'space-evenly'
        },
        '& .p-grid': {
            margin: '0.5em'
        },
        '& .p-dataview': {
            '& .p-dataview-content': {
                overflowY: 'auto',
                maxHeight: 'inherit',
                background: 'none',
                '& .p-card': {
                    '& .p-card-content': {
                        padding: 0
                    }
                }
            }
        },
        '& .p-splitter-panel': {
            overflowY: 'auto'
        },
        '& .p-toolbar-group-left': {
            flexGrow: 1
        }
    }
});

const empty = [];

const Explorer: ComponentProps = ({
    className,
    keyField,
    fetch: fetchParams,
    subscribe,
    schema,
    resultSet,
    children,
    details,
    toolbar,
    filter: externalFilter,
    params,
    design: designDefault,
    onDropdown,
    showFilter = true,
    pageSize = 10,
    table: tableProps,
    view: viewProps,
    customization,
    onCustomization,
    onFieldChange,
    onChange,
    value,
    name,
    hidden,
    layouts,
    layout: layoutName,
    cards,
    editors,
    methods,
    fetchValidation
}) => {
    const [trigger, setTrigger] = React.useState<() => void>();
    const [paramValues, submitParams] = React.useState<[Record<string, unknown>] | [Record<string, unknown>, {files: []}]>([params]);
    const [filter, index] = React.useMemo(() => [
        {
            [resultSet]: paramValues[0]?.params
        },
        {
            ...paramValues[1],
            files: paramValues?.[1]?.files?.map((name: string) => `${resultSet}.${name.slice(7)}`) // cut the params. prefix
        }
    ], [paramValues, resultSet]);

    const [loading, setLoading] = React.useState('');
    const [inspectorHeight, setInspectorHeight] = React.useState<{maxHeight: number}>();
    const [
        customizationToolbar,
        mergedSchema,
        mergedCards,
        inspector,
        loadCustomization,
        ,
        ,
        ,
        formProps,
        ,
        ,
        ,
        formApi,
        isPropertyRequired
    ] = useCustomization(
        designDefault,
        schema,
        cards,
        layouts,
        customization,
        'view',
        '',
        Editor,
        inspectorHeight,
        onCustomization,
        methods,
        name,
        loading,
        undefined,
        editors
    );
    const layoutProps = layouts?.[layoutName] || {toolbar: undefined};
    const columnsCard = ('columns' in layoutProps) ? layoutProps.columns : 'browse';
    const toolbarCard = ('toolbar' in layoutProps) ? layoutProps.toolbar : 'toolbarBrowse';
    const layout = ('layout' in layoutProps) ? layoutProps.layout : empty;
    const columns = ('layout' in layoutProps) ? empty : mergedCards[columnsCard]?.widgets ?? empty;
    const paramsLayout = ('params' in layoutProps) && layoutProps.params;
    const fetch = React.useMemo(() => (!paramsLayout || paramValues.length > 1) && fetchParams, [fetchParams, paramValues, paramsLayout]);
    if (toolbar !== false) toolbar = ('layout' in layoutProps) ? ('toolbar' in layoutProps ? mergedCards[layoutProps.toolbar]?.widgets : toolbar) : mergedCards[toolbarCard]?.widgets ?? toolbar;
    const classes = useStyles();
    const {properties} = mergedSchema;
    const [tableFilter, setFilters] = React.useState<TableFilter>({
        filters: columns?.reduce((prev : object, column) => {
            let field = fieldName(column);
            const value = lodashGet(externalFilter, field);
            field = field.split('.').pop();
            return (value === undefined) ? {...prev, [field]: {matchMode: 'contains'}} : {...prev, [field]: {value, matchMode: 'contains'}};
        }, {}),
        first: 0,
        page: 1
    });
    const multiSelect = keyField && (!tableProps?.selectionMode || tableProps?.selectionMode === 'checkbox');
    const handleFilterPageSort = React.useCallback(event => setFilters(prev => ({...prev, ...event})), []);

    const [{current: currentState, selected: selectedState}, setCurrentSelected] = React.useState({current: null, selected: null});
    const handleCurrentSelect = React.useCallback((value, event) => {
        setCurrentSelected(({...prev}) => {
            if ('current' in value) prev.current = value.current;
            if ('selected' in value) prev.selected = value.selected;
            if (event) onChange?.({...event, value: multiSelect ? prev : prev.current});
            return prev;
        });
    }, [setCurrentSelected, multiSelect, onChange]);

    const handleSelectionChange = React.useCallback(e => handleCurrentSelect({selected: e.value}, e), [handleCurrentSelect]);
    const handleRowSelect = React.useCallback(e => handleCurrentSelect({current: e.data}, e), [handleCurrentSelect]);
    const handleRowUnselect = React.useCallback(e => handleCurrentSelect({current: null}, e), [handleCurrentSelect]);
    const rowClass = React.useCallback(
        (data: object) => currentState && (data?.[keyField] === currentState?.[keyField]) ? classes.current : undefined,
        [currentState, classes, keyField]
    );

    const [navigationOpened, navigationToggle] = useToggle(true);
    const [detailsOpened, detailsToggle] = useToggle(true);

    const [[items, totalRecords, result], setItems] = React.useState([[], 0, {}]);
    const keys = onChange && keyField && (multiSelect ? value?.selected?.map(item => item[keyField]) : [value?.[keyField]]);
    const found = keys && items?.filter(item => keys.includes(item[keyField]));
    const [current, selected] = found ? [found[0], found] : [currentState, selectedState];

    const [dropdowns, setDropdown] = React.useState({});

    const [dropdownNames, layoutFields] = React.useMemo(() => {
        const {fields, dropdownNames} = paramsLayout ? fieldNames(paramsLayout, mergedCards, mergedSchema, editors) : {fields: [], dropdownNames: []};
        return [
            (columns || [])
                .flat()
                .filter(Boolean)
                .map(column => lodashGet(properties, fieldName(column)?.replace(/\./g, '.properties.'))?.widget?.dropdown)
                .filter(Boolean)
                .concat(dropdownNames)
                .join(','),
            fields
        ];
    }, [columns, editors, mergedCards, mergedSchema, paramsLayout, properties]);

    const getValues = React.useMemo(() => () => ({
        id: current && current[keyField],
        current,
        selected,
        filter: externalFilter
    }), [current, keyField, selected, externalFilter]);

    const submit = React.useCallback(async({method, params}) => {
        await methods[method](prepareSubmit([getValues(), {}, {method, params}]));
    }, [methods, getValues]);

    const buttons = React.useMemo(() => (toolbar || []).map((widget, index) => {
        const {title, action, method, params, enabled, disabled, permission, menu} = (typeof widget === 'string') ? properties[widget].widget : widget;
        const check = criteria => {
            if (typeof criteria?.validate === 'function') return !criteria.validate({current, selected}).error;
            if (typeof criteria !== 'string') return !!criteria;
            switch (criteria) {
                case 'current': return !!current;
                case 'selected': return selected && selected.length > 0;
                case 'single': return selected && selected.length === 1;
                default: return false;
            }
        };
        const isDisabled =
            enabled != null
                ? !check(enabled)
                : disabled != null
                    ? check(disabled)
                    : undefined;
        return <ActionButton
            key={index}
            permission={permission}
            {...testid(`${permission ? (permission + 'Button') : ('button' + index)}`)}
            label={title}
            submit={submit}
            action={action}
            method={method}
            params={params}
            menu={menu}
            getValues={getValues}
            disabled={isDisabled}
            className="mr-2"
        />;
    }
    ), [toolbar, current, selected, getValues, properties, submit]);
    const {toast, handleSubmit: load} = useSubmit(
        async function() {
            if (!fetch) {
                setItems([[], 0, {}]);
                setDropdown({});
            } else {
                setLoading('loading');
                try {
                    const fetchParams = prepareSubmit([merge(
                        {},
                        filter,
                        externalFilter,
                        {
                            [resultSet || 'filterBy']: Object.entries(tableFilter.filters).reduce((prev, [name, {value}]) => ({...prev, [name]: value}), {})
                        },
                        tableFilter.sortField && {
                            orderBy: [{
                                field: tableFilter.sortField,
                                dir: {[-1]: 'DESC', 1: 'ASC'}[tableFilter.sortOrder]
                            }]
                        },
                        pageSize && {
                            paging: {
                                pageSize,
                                pageNumber: Math.floor(tableFilter.first / pageSize) + 1
                            }
                        }
                    ), index]);
                    if (typeof fetchValidation?.validate === 'function' && fetchValidation.validate(fetchParams)?.error) return;
                    const items = await fetch(fetchParams);
                    const records = (resultSet ? items[resultSet] : items) as unknown[];
                    let total = items.pagination?.recordsTotal || items.pagination?.[0]?.recordsTotal;
                    if (total == null) {
                        total = (Array.isArray(records) && records.length) || 0;
                        if (total === pageSize) total++;
                        total = tableFilter.first + total;
                    }
                    setItems([records, total, items]);
                } finally {
                    setLoading('');
                }
            }
        },
        [fetch, filter, index, pageSize, resultSet, tableFilter, externalFilter, fetchValidation]
    );
    useLoad(async() => {
        if (onDropdown) setDropdown(await onDropdown(dropdownNames.split(',').filter(Boolean)));
    }, [onDropdown, dropdownNames]);
    React.useEffect(() => {
        load();
        if (subscribe && !formProps.design) {
            return subscribe(rows => {
                setItems(([items, totalRecords, result]) => [(Array.isArray(rows) || !keyField) ? rows as unknown[] : items.map(item => {
                    const update = rows[item[keyField]];
                    return update ? {...item, ...update} : item;
                }), totalRecords, result]);
            });
        }
    }, [keyField, load, subscribe, formProps.design]);
    React.useEffect(() => {
        loadCustomization();
    }, [loadCustomization]);

    const windowSize = useWindowSize();
    const [height, setHeight] = React.useState<{height: number}>();
    const [maxHeight, setMaxHeight] = React.useState<{maxHeight: number}>();
    const [splitterHeight, setSplitterHeight] = React.useState({});

    const max = maxHeight => (!isNaN(maxHeight) && maxHeight > 0) ? Math.floor(maxHeight) : 0;

    const tableWrapRef = React.useCallback(node => {
        if (node === null || hidden) return;
        const nodeRect = node.getBoundingClientRect();
        const paginatorHeight = node.querySelector('.p-paginator')?.getBoundingClientRect?.()?.height;
        setHeight({height: max(windowSize.height - nodeRect.top)});
        setMaxHeight({maxHeight: max(windowSize.height - nodeRect.top - paginatorHeight)});
        setInspectorHeight({maxHeight: max(windowSize.height - nodeRect.top)});
    }, [windowSize, formProps.design, hidden]); // eslint-disable-line react-hooks/exhaustive-deps

    const splitterWrapRef = React.useCallback(node => {
        if (node === null || hidden) return;
        const nodeRect = node.getBoundingClientRect();
        setSplitterHeight({flexGrow: 1, height: max(windowSize.height - nodeRect.top)});
    }, [windowSize, hidden]);

    const detailsPanel = React.useMemo(() => detailsOpened && details &&
        <SplitterPanel style={height} key='details' size={10}>
            <div className='w-full'>{
                <Component {...details} value={{preview: {...result, ...getValues()}}} />
            }</div>
        </SplitterPanel>, [getValues, result, details, detailsOpened, height]);

    const filterBy = (name: string, key: string) => e => {
        const value = lodashGet(e, key);
        setFilters(prev => {
            const next = {
                ...prev,
                filters: {
                    ...prev?.filters,
                    [name]: {
                        ...prev?.filters?.[name],
                        value: value === '' ? undefined : value
                    }
                }
            };
            return next;
        });
    };

    const filterDisplay = React.useMemo(() => showFilter && columns.some(column => {
        const isString = typeof column === 'string';
        const {name, ...widget} = isString ? {name: column} : column;
        const property = lodashGet(properties, name?.replace(/\./g, '.properties.'));
        return !!property?.filter || widget?.column?.filter;
    }), [columns, properties, showFilter]) ? 'row' : undefined;

    const Columns = React.useMemo(() => columns.map((column, index) => {
        const isString = typeof column === 'string';
        const {name, ...widget} = isString ? {name: column} : column;
        const property = lodashGet(properties, name?.replace(/\./g, '.properties.'));
        const action = widget.action ?? property?.action;
        const field = name.split('.').pop();
        return (
            <Column
                key={name}
                body={action && (row => <ActionButton
                    {...testid(`${resultSet || 'filterBy'}.${field}Item/${row && row[keyField]}`)}
                    label={row[field]}
                    className='p-button-link p-0'
                    action={action}
                    submit={submit}
                    params={widget.params ?? property?.params}
                    getValues={() => ({
                        filter: externalFilter,
                        id: row && row[keyField],
                        current: row,
                        selected: [row]
                    })}
                    // onClick={() => property.action({
                    //     id: row && row[keyField],
                    //     current: row,
                    //     selected: [row]
                    // })}
                />)}
                filter={showFilter && !!property?.filter}
                sortable={!!property?.sort}
                {...columnProps({index, card: columnsCard, name, widget: !isString && widget, property, dropdowns, tableFilter, filterBy, ...formProps})}
            />
        );
    }), [columns, columnsCard, properties, showFilter, dropdowns, tableFilter, keyField, resultSet, formProps, externalFilter, submit]);
    const hasChildren = !!children;

    const paramsElement = React.useMemo(() => {
        if (!paramsLayout) return null;
        return <div className='flex align-items-center w-full'>
            <Form
                className='p-0 m-0 flex-grow-1'
                schema={mergedSchema}
                editors={editors}
                methods={methods}
                cards={cards}
                layout={paramsLayout}
                onSubmit={submitParams}
                value={paramValues[0]}
                dropdowns={dropdowns}
                setTrigger={setTrigger}
                layoutFields={layoutFields}
                formApi={formApi}
                isPropertyRequired={isPropertyRequired}
                triggerNotDirty
                autoSubmit
                {...formProps}
                designCards={false}
            />
        </div>;
    }, [paramsLayout, mergedSchema, editors, methods, cards, paramValues, dropdowns, formProps, layoutFields, formApi, isPropertyRequired]);

    const left = React.useMemo(() => paramsElement ?? <>
        {hasChildren && <Button {...testid(`${resultSet}.navigator.toggleButton`)} icon="pi pi-bars" className="mr-2" onClick={navigationToggle}/>}
        {buttons}
    </>, [navigationToggle, buttons, hasChildren, resultSet, paramsElement]);
    const right = <>
        <Button icon="pi pi-search" className="mr-2 ml-2" disabled={!!loading} onClick={trigger || load} {...testid(`${resultSet}.refreshButton`)}/>
        {details && <Button {...testid(`${resultSet}.details.toggleButton`)} icon="pi pi-bars" className="mr-2" onClick={detailsToggle}/>}
        {customizationToolbar}
    </>;
    const layoutState = useLayout(mergedSchema, mergedCards, layout, editors, keyField, layoutFields);
    const cardName = layout?.flat()[0];
    const itemTemplate = React.useMemo(() => item => {
        function renderItem() {
            const card = <Card
                index1={0}
                index2={0}
                cards={mergedCards}
                cardName={cardName}
                layoutState={layoutState}
                dropdowns={dropdowns}
                methods={methods}
                value={item}
                onFieldChange={onFieldChange}
                classNames={{
                    widget: 'grid field justify-content-center'
                }}
            />;
            return keyField ? <div
                {...testid(`${resultSet || 'filterBy'}.${keyField}/${item && item[keyField]}`)}
                className={clsx('cursor-pointer', (cardName && mergedCards?.[typeof cardName === 'string' ? cardName : cardName.name]?.className) || 'col-6 lg:col-2 md:col-3 sm:col-4')}
                onClick={layoutState.open?.(item)}
            >{card}</div> : card;
        }
        return renderItem();
    }, [mergedCards, layoutState, dropdowns, methods, keyField, resultSet, cardName, onFieldChange]);
    const table = (
        <div ref={tableWrapRef} style={height}>
            {layout?.length ? <DataView
                layout='grid'
                style={maxHeight}
                lazy
                gutter
                rows={pageSize}
                totalRecords={totalRecords}
                paginator
                first={tableFilter.first}
                sortField={tableFilter.sortField}
                sortOrder={tableFilter.sortOrder}
                value={items}
                onPage={handleFilterPageSort}
                itemTemplate={itemTemplate}
                {...viewProps}
            /> : <DataTable
                scrollable
                scrollHeight='flex'
                autoLayout
                lazy
                rows={pageSize}
                totalRecords={totalRecords}
                paginator
                first={tableFilter.first}
                sortField={tableFilter.sortField}
                sortOrder={tableFilter.sortOrder}
                filters={tableFilter.filters}
                onPage={handleFilterPageSort}
                onSort={handleFilterPageSort}
                onFilter={handleFilterPageSort}
                loading={!!loading}
                dataKey={keyField}
                value={items}
                rowClassName={rowClass}
                selection={selected}
                filterDisplay={filterDisplay}
                onSelectionChange={handleSelectionChange}
                onRowSelect={handleRowSelect}
                onRowUnselect={handleRowUnselect}
                {...tableProps}
            >
                {multiSelect && <Column selectionMode="multiple" className='flex-grow-0'/>}
                {Columns}
            </DataTable>}
        </div>
    );
    const nav = children && navigationOpened && <SplitterPanel style={height} key='nav' size={15}>
        {children}
    </SplitterPanel>;
    return (
        <div className={clsx('flex', 'flex-column', classes.explorer, className)}>
            {toast}
            {
                toolbar !== false
                    ? <Toolbar left={left} right={right} style={backgroundNone} className='border-none p-2 flex-nowrap' />
                    : null
            }
            <div className='flex'>
                <div className={formProps.design ? 'col-10' : 'flex-grow-1'} style={inspectorHeight}>
                    {
                        (nav || detailsPanel)
                            ? <div ref={splitterWrapRef}>
                                <Splitter style={splitterHeight} {...name && {stateKey: `${name}.splitter`, stateStorage: 'local'}}>
                                    {[
                                        nav,
                                        <SplitterPanel style={height} key='items' size={nav ? detailsPanel ? 75 : 85 : 90}>
                                            {table}
                                        </SplitterPanel>,
                                        detailsPanel
                                    ].filter(Boolean)}
                                </Splitter>
                            </div>
                            : table
                    }
                </div>
                {inspector}
            </div>
        </div>
    );
};

export default Explorer;
