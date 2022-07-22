import React from 'react';
import lodashGet from 'lodash.get';
import merge from 'ut-function.merge';
import clsx from 'clsx';
import {createUseStyles} from 'react-jss';

import Card from '../Card';
import { Button, DataTable, DataView, Column, Toolbar, Splitter, SplitterPanel } from '../prime';
import ActionButton from '../ActionButton';
import Permission from '../Permission';
import useToggle from '../hooks/useToggle';
import useSubmit from '../hooks/useSubmit';
import useLayout from '../hooks/useLayout';
import columnProps, {TableFilter} from '../lib/column';
import prepareSubmit from '../lib/prepareSubmit';

import { ComponentProps } from './Explorer.types';
import testid from '../lib/testid';

const flexGrow = {flexGrow: 1};
const selectionWidth = {width: '3em'};
const backgroundNone = {background: 'none'};
const splitterWidth = { width: '200px' };
const actionButtonStyle = {padding: 0, minWidth: 'inherit'};

const fieldName = column => typeof column === 'string' ? column : column.name;

const useStyles = createUseStyles({
    explorer: {
        '& .p-datatable-wrapper': {
            overflowX: 'auto'
        },
        '& .p-grid': {
            margin: '0.5em'
        },
        '& .p-dataview': {
            '& .p-dataview-content': {
                background: 'none',
                '& .p-card': {
                    '& .p-card-content': {
                        padding: 0
                    }
                }
            }
        }
    },
    details: {
        marginBottom: 15
    },
    detailsLabel: {},
    detailsValue: {}
});

const Explorer: ComponentProps = ({
    className,
    keyField,
    fetch,
    subscribe,
    schema,
    columns,
    resultSet,
    children,
    details,
    toolbar,
    filter,
    index,
    onDropdown,
    showFilter = true,
    pageSize = 10,
    table: tableProps,
    view: viewProps,
    layout,
    cards,
    editors,
    methods
}) => {
    const classes = useStyles();
    const {properties} = schema;
    const [tableFilter, setFilters] = React.useState<TableFilter>({
        filters: columns?.reduce((prev : object, column) => {
            let field = fieldName(column);
            const value = lodashGet(filter, field);
            field = field.split('.').pop();
            return (value === undefined) ? {...prev, [field]: {matchMode: 'contains'}} : {...prev, [field]: {value, matchMode: 'contains'}};
        }, {}),
        first: 0,
        page: 1
    });
    const handleFilterPageSort = React.useCallback(event => setFilters(prev => ({...prev, ...event})), []);

    const [selected, setSelected] = React.useState(null);
    const handleSelectionChange = React.useCallback(e => setSelected(e.value), []);

    const [current, setCurrent] = React.useState(null);
    const handleRowSelect = React.useCallback(e => setCurrent(e.data), []);

    const [navigationOpened, navigationToggle] = useToggle(true);
    const [detailsOpened, detailsToggle] = useToggle(true);

    const [loading, setLoading] = React.useState(false);
    const [[items, totalRecords], setItems] = React.useState([[], 0]);
    const [dropdowns, setDropdown] = React.useState({});

    const dropdownNames = (columns || [])
        .flat()
        .filter(Boolean)
        .map(column => lodashGet(properties, fieldName(column)?.replace(/\./g, '.properties.'))?.widget?.dropdown)
        .filter(Boolean)
        .join(',');

    const getValues = React.useMemo(() => () => ({
        id: current && current[keyField],
        current,
        selected
    }), [current, keyField, selected]);

    const buttons = React.useMemo(() => (toolbar || []).map(({title, action, params, enabled = true, permission}, index) => {
        const isEnabled = enabled => {
            if (typeof enabled !== 'string') return !!enabled;
            switch (enabled) {
                case 'current': return !!current;
                case 'selected': return selected && selected.length > 0;
                case 'single': return selected && selected.length === 1;
                default: return false;
            }
        };
        return (
            <Permission key={index} permission={permission}>
                <ActionButton
                    {...testid(`${permission ? (permission + 'Button') : ('button' + index)}`)}
                    label={title}
                    action={action}
                    params={params}
                    getValues={getValues}
                    disabled={!isEnabled(enabled)}
                    className="mr-2"
                />
            </Permission>
        );
    }
    ), [toolbar, current, selected, getValues]);
    const {toast, handleSubmit: load} = useSubmit(
        async function() {
            if (!fetch) {
                setItems([[], 0]);
                setDropdown({});
            } else {
                setLoading(true);
                try {
                    const items = await fetch(prepareSubmit([merge(
                        {},
                        filter,
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
                    ), index]));
                    const records = resultSet ? items[resultSet] : items;
                    let total = items.pagination && items.pagination.recordsTotal;
                    if (total == null) {
                        total = (records && records.length) || 0;
                        if (total === pageSize) total++;
                        total = tableFilter.first + total;
                    }
                    setItems([records, total]);
                    if (onDropdown) setDropdown(await onDropdown(dropdownNames.split(',').filter(Boolean)));
                } finally {
                    setLoading(false);
                }
            }
        },
        [dropdownNames, fetch, filter, index, onDropdown, pageSize, resultSet, tableFilter]
    );
    React.useEffect(() => {
        load();
        if (subscribe) {
            return subscribe(rows => {
                setItems(([items, totalRecords]) => [(Array.isArray(rows) || !keyField) ? rows : items.map(item => {
                    const update = rows[item[keyField]];
                    return update ? {...item, ...update} : item;
                }), totalRecords]);
            });
        }
    }, [keyField, load, subscribe]);
    const detailsPanel = React.useMemo(() => detailsOpened && details &&
        <SplitterPanel key='details' size={10}>
            <div style={splitterWidth}>{
                current && Object.entries(details).map(([name, value], index) =>
                    <div className={classes.details} key={index}>
                        <div className={classes.detailsLabel}>{value}</div>
                        <div className={classes.detailsValue}>{current[name]}</div>
                    </div>
                )
            }</div>
        </SplitterPanel>, [classes.details, classes.detailsLabel, classes.detailsValue, current, details, detailsOpened]);

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

    const Columns = React.useMemo(() => columns.map(column => {
        const isString = typeof column === 'string';
        const {name, ...widget} = isString ? {name: column} : column;
        const property = lodashGet(properties, name?.replace(/\./g, '.properties.'));
        const field = name.split('.').pop();
        return (
            <Column
                key={name}
                body={property?.action && (row => <Button
                    {...testid(`${resultSet || 'filterBy'}.${field}Item/${row && row[keyField]}`)}
                    label={row[field]}
                    style={actionButtonStyle}
                    className='p-button-link'
                    onClick={() => property.action({
                        id: row && row[keyField],
                        current: row,
                        selected: [row]
                    })}
                />)}
                filter={showFilter && !!property?.filter}
                sortable={!!property?.sort}
                {...columnProps({resultSet, name: field, widget: !isString && widget, property, dropdowns, tableFilter, filterBy})}
            />
        );
    }), [columns, properties, showFilter, dropdowns, tableFilter, keyField, resultSet]);
    const hasChildren = !!children;
    const left = React.useMemo(() => <>
        {hasChildren && <Button {...testid(`${resultSet}.navigator.toggleButton`)} icon="pi pi-bars" className="mr-2" onClick={navigationToggle}/>}
        {buttons}
    </>, [navigationToggle, buttons, hasChildren, resultSet]);
    const right = React.useMemo(() =>
        <>
            <Button icon="pi pi-refresh" className="mr-2" onClick={load} />
            {details && <Button {...testid(`${resultSet}.details.toggleButton`)} icon="pi pi-bars" className="mr-2" onClick={detailsToggle}/>}
        </>,
    [details, detailsToggle, resultSet, load]);
    const layoutState = useLayout(schema, cards, layout, editors, keyField);
    const cardName = layout?.flat()[0];
    const itemTemplate = React.useMemo(() => item => {
        function renderItem() {
            const card = <Card
                index1={0}
                index2={0}
                cards={cards}
                cardName={cardName}
                layoutState={layoutState}
                dropdowns={dropdowns}
                methods={methods}
                value={item}
                classNames={{
                    field: 'grid field justify-content-center'
                }}
            />;
            return keyField ? <div
                {...testid(`${resultSet || 'filterBy'}.${keyField}/${item && item[keyField]}`)}
                className={clsx('cursor-pointer', (cardName && cards?.[typeof cardName === 'string' ? cardName : cardName.name]?.className) || 'col-6 lg:col-2 md:col-3 sm:col-4')}
                onClick={layoutState.open?.(item)}
            >{card}</div> : card;
        }
        return renderItem();
    }, [cards, layoutState, dropdowns, methods, keyField, resultSet, cardName]);

    const table = layout ? <DataView
        layout='grid'
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
        loading={loading}
        dataKey={keyField}
        value={items}
        selection={selected}
        filterDisplay='row'
        onSelectionChange={handleSelectionChange}
        onRowSelect={handleRowSelect}
        {...tableProps}
    >
        {keyField && (!tableProps?.selectionMode || tableProps?.selectionMode === 'checkbox') && <Column selectionMode="multiple" style={selectionWidth}/>}
        {Columns}
    </DataTable>;
    const nav = children && navigationOpened && <SplitterPanel key='nav' size={15}>{children}</SplitterPanel>;
    return (
        <div className={clsx('flex', 'flex-column', 'h-full', classes.explorer, className)}>
            {toast}
            {
                buttons?.length || nav || detailsPanel
                    ? <Toolbar left={left} right={right} style={backgroundNone} className='border-none' />
                    : null
            }
            {
                (nav || detailsPanel)
                    ? <Splitter style={flexGrow}>
                        {[
                            nav,
                            <SplitterPanel key='items' size={nav ? detailsPanel ? 75 : 85 : 90}>
                                {table}
                            </SplitterPanel>,
                            detailsPanel
                        ].filter(Boolean)}
                    </Splitter>
                    : table
            }
        </div>
    );
};

export default Explorer;
