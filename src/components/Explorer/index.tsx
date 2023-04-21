import React from 'react';
import lodashGet from 'lodash.get';
import merge from 'ut-function.merge';
import clsx from 'clsx';
import {createUseStyles} from 'react-jss';
import Joi from 'joi';

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
import getValidation from '../Form/schema';
import skip from '../lib/skip';
import fieldNames from '../lib/fields';
import columnProps from '../lib/column';
import useFilter from '../hooks/useFilter';
import prepareSubmit from '../lib/prepareSubmit';
import Context from '../Text/context';

import { ComponentProps, Props } from './Explorer.types';
import testid from '../lib/testid';
import useCustomization from '../hooks/useCustomization';
import useButtons from '../hooks/useButtons';

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
        '& .p-datatable-tbody td .value': {
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        '& .p-datatable-wrapper': {
            overflowX: 'auto',
            maxWidth: '100vw',
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

const FilterErrors = ({errors}: {errors: Joi.ValidationError['details']}) => {
    return <Button
        className='absolute m-2 top-0 right-0 z-2 pre p-button-rounded p-button-danger'
        icon='pi pi-exclamation-triangle'
        onClick={() => {}}
        tooltip={errors.map(error => error.message).join('\n')}
        tooltipOptions={{position: 'top'}}
    />;
};

const detailsProps = (result, getValues, {current, ...props}: Props['details']) => {
    const values = getValues();
    return {
        ...props,
        value: {
            preview: {...result, ...values},
            ...current && {[current]: values.current}
        }
    };
};

const Explorer: ComponentProps = ({
    className,
    keyField,
    fetch: fetchParams,
    fetchTransform,
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
    resize,
    refresh,
    layouts,
    layout: layoutName,
    cards,
    editors,
    methods,
    fetchValidation
}) => {
    const [trigger, setTrigger] = React.useState<() => Promise<void>>();
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
    const ctx = React.useContext(Context);

    const [loading, setLoading] = React.useState('');
    const [inspectorHeight, setInspectorHeight] = React.useState<{maxHeight: number}>();
    const {
        customizationToolbar,
        mergedSchema,
        mergedCards,
        inspector,
        loadCustomization,
        formProps,
        formApi,
        isPropertyRequired
    } = useCustomization({
        designDefault,
        schema,
        cards,
        layouts,
        customization,
        Editor,
        maxHeight: inspectorHeight,
        onCustomization,
        methods,
        name,
        loading,
        editors
    });
    const layoutProps = layouts?.[layoutName] || {toolbar: undefined};
    const columnsCard = ('columns' in layoutProps) ? layoutProps.columns : 'browse';
    const toolbarCard = ('toolbar' in layoutProps) ? layoutProps.toolbar : 'toolbarBrowse';
    const layout = ('layout' in layoutProps) ? layoutProps.layout : empty;
    const columns = ('layout' in layoutProps) ? empty : mergedCards[columnsCard]?.widgets ?? empty;
    const paramsLayout = ('params' in layoutProps) && layoutProps.params;
    const fetch = React.useMemo(() => (!paramsLayout?.length || paramValues.length > 1) && fetchParams, [fetchParams, paramValues, paramsLayout]);
    if (toolbar !== false) toolbar = ('layout' in layoutProps) ? ('toolbar' in layoutProps ? mergedCards[layoutProps.toolbar]?.widgets : toolbar) : mergedCards[toolbarCard]?.widgets ?? toolbar;
    const classes = useStyles();
    const {properties} = mergedSchema;
    const [tableFilter, setFilters, filterBy, filterProps] = useFilter({
        filters: columns?.reduce((prev : object, column) => {
            let field = fieldName(column);
            const value = lodashGet(externalFilter, field);
            field = field.split('.').pop();
            return (value === undefined) ? {...prev, [field]: {matchMode: 'contains'}} : {...prev, [field]: {value, matchMode: 'contains'}};
        }, {}),
        first: 0,
        page: 1
    }, columns, properties, showFilter);
    const multiSelect = keyField && (!tableProps?.selectionMode || tableProps?.selectionMode === 'checkbox');

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
        const {fields, dropdownNames} = paramsLayout ? fieldNames(paramsLayout, mergedCards, mergedSchema, editors, ctx.translate) : {fields: [], dropdownNames: []};
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
    }, [columns, editors, mergedCards, mergedSchema, paramsLayout, properties, ctx.translate]);

    const validation = React.useMemo(() => fetchValidation || (mergedSchema.properties?.fetch && getValidation(mergedSchema.properties?.fetch, ctx.translate)[0]), [fetchValidation, mergedSchema.properties?.fetch, ctx.translate]);

    const getValues = React.useMemo(() => ({$ = undefined, ...params} = {}) => ({
        params,
        pageSize,
        pageNumber: pageSize && (Math.floor(tableFilter.first / pageSize) + 1),
        id: current && current[keyField],
        current,
        selected,
        filter: merge(
            {},
            externalFilter,
            Object.entries(tableFilter.filters).reduce((prev, [name, {value}]) => ({...prev, [name]: value}), {})
        )
    }), [current, keyField, selected, externalFilter, pageSize, tableFilter]);

    const submit = React.useCallback(async({method, params}, form?) => {
        params = prepareSubmit([getValues(form?.params), {}, {method, params}]);
        const system = params?.$;
        delete params?.$;
        setLoading('loading');
        try {
            await methods[method](params);
        } finally {
            setLoading('');
        }
        if (system?.fetch) setFilters(prev => merge({}, prev, system.fetch));
    }, [methods, getValues, setFilters]);

    const handleSubmit = React.useCallback(params => {
        if (params?.[2]?.method) {
            submit(params[2], params[0]);
        } else {
            submitParams(params);
        }
    }, [submitParams, submit]);

    const buttons = useButtons({ selected, toolbar, properties, getValues, paramsLayout, trigger, current, loading, submit });
    const [filterErrors, setFilterErrors] = React.useState<Joi.ValidationError>();
    const {toast, handleSubmit: load} = useSubmit(
        async function() {
            if (!fetch) {
                setItems([[], 0, {}]);
                setCurrentSelected({current: null, selected: null});
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
                    const transformed = fetchTransform ? fetchTransform(fetchParams) : fetchParams;
                    const errors = validation?.validate?.(skip(transformed), {abortEarly: false})?.error;
                    setFilterErrors(errors);
                    if (errors) return;
                    const items = await fetch(transformed);
                    const records = (resultSet ? items[resultSet] : items) as unknown[];
                    let total = items.pagination?.recordsTotal || items.pagination?.[0]?.recordsTotal;
                    if (total == null) {
                        total = (Array.isArray(records) && records.length) || 0;
                        if (total === pageSize) total++;
                        total = tableFilter.first + total;
                    }
                    setItems([records, total, items]);
                    setCurrentSelected(({...prev}) => {
                        prev.selected = records.filter(r => prev.selected?.some(ss => r[keyField] === ss?.[keyField])) || null;
                        prev.current = records.find(r => r[keyField] === prev.current?.[keyField]) || prev.selected?.[0] || null;
                        onChange?.({value: multiSelect ? prev : prev.current});
                        return prev;
                    });
                } finally {
                    setLoading('');
                }
            }
        },
        [fetch, filter, index, pageSize, resultSet, tableFilter, externalFilter, validation, fetchTransform, keyField, onChange, multiSelect]
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
    React.useEffect(() => {
        if (refresh && totalRecords && !hidden && !loading) {
            load();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh, totalRecords, hidden, load]);

    const windowSize = useWindowSize();
    const [height, setHeight] = React.useState<{height: number}>();
    const [maxHeight, setMaxHeight] = React.useState<{maxHeight: number}>();
    const [splitterHeight, setSplitterHeight] = React.useState({});

    const max = maxHeight => (!isNaN(maxHeight) && maxHeight > 0) ? Math.floor(maxHeight) : 0;

    const tableWrapRef = React.useCallback(node => {
        if (node === null || hidden || resize === false) return;
        const nodeRect = node.getBoundingClientRect();
        const paginatorHeight = node.querySelector('.p-paginator')?.getBoundingClientRect?.()?.height;
        setHeight({height: max(windowSize.height - nodeRect.top)});
        setMaxHeight({maxHeight: max(windowSize.height - nodeRect.top - paginatorHeight)});
        setInspectorHeight({maxHeight: max(windowSize.height - nodeRect.top)});
    }, [windowSize, formProps.design, hidden, resize]); // eslint-disable-line react-hooks/exhaustive-deps

    const splitterWrapRef = React.useCallback(node => {
        if (node === null || hidden || resize === false) return;
        const nodeRect = node.getBoundingClientRect();
        setSplitterHeight({flexGrow: 1, height: max(windowSize.height - nodeRect.top)});
    }, [windowSize, hidden, resize]);

    const detailsPanel = React.useMemo(() => detailsOpened && details &&
        <SplitterPanel style={height} key='details' size={10}>
            <div className='w-full'>{
                <Component {...detailsProps(result, getValues, details)} />
            }</div>
        </SplitterPanel>, [getValues, result, details, detailsOpened, height]);

    const [Columns, errorsWithoutColumn] = React.useMemo(() => {
        const errorsWithoutColumn = filterErrors ? [...filterErrors.details] : [];
        return [columns.map((column, index) => {
            const isString = typeof column === 'string';
            const {name, ...widget} = isString ? {name: column} : column;
            const property = lodashGet(properties, name?.replace(/\./g, '.properties.'));
            const action = widget.action ?? property?.action;
            const field = name.split('.').pop();
            return (
                <Column
                    key={name}
                    filter={showFilter && !!property?.filter}
                    sortable={!!property?.sort}
                    {...columnProps({
                        index,
                        card: columnsCard,
                        name,
                        widget: !isString && widget,
                        property,
                        dropdowns,
                        tableFilter,
                        filterBy,
                        filterErrors,
                        errorsWithoutColumn,
                        ctx,
                        ...formProps
                    })}
                    {...action && {
                        body: row => <ActionButton
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
                        />
                    }}
                />
            );
        }), errorsWithoutColumn.filter(Boolean)];
    }, [
        columns,
        columnsCard,
        properties,
        showFilter,
        dropdowns,
        tableFilter,
        keyField,
        resultSet,
        formProps,
        externalFilter,
        submit,
        filterBy,
        filterErrors,
        ctx
    ]);
    const hasChildren = !!children;

    const left = paramsLayout ? <div className='flex align-items-center w-full'>
        <Form
            className='p-0 m-0 flex-grow-1'
            schema={mergedSchema}
            editors={editors}
            methods={methods}
            cards={cards}
            layout={paramsLayout}
            onSubmit={handleSubmit}
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
    </div> : <>
        {hasChildren && <Button {...testid(`${resultSet}.navigator.toggleButton`)} icon="pi pi-bars" className="mr-2" onClick={navigationToggle}/>}
        {buttons}
    </>;
    const right = <>
        <Button icon="pi pi-search" className="mr-2 ml-2" disabled={!!loading} onClick={trigger || load} {...testid(`${resultSet}.refreshButton`)}/>
        {paramsLayout ? buttons : null}
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
        <div ref={tableWrapRef} style={height} className='relative'>
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
                onPage={filterProps.onPage as () => void}
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
                {...filterProps}
                loading={!!loading}
                dataKey={keyField}
                value={items}
                rowClassName={rowClass}
                selection={selected}
                onSelectionChange={handleSelectionChange}
                onRowSelect={handleRowSelect}
                onRowUnselect={handleRowUnselect}
                {...tableProps}
            >
                {multiSelect && <Column selectionMode="multiple" className='flex-grow-0'/>}
                {Columns}
            </DataTable>}
            {errorsWithoutColumn.length ? <FilterErrors errors={errorsWithoutColumn}/> : null}
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
