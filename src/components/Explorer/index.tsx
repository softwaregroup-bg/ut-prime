import React from 'react';
import lodashGet from 'lodash.get';
import { DataTable, Column, Button, Toolbar, Splitter, SplitterPanel, Checkbox, Dropdown } from '../prime';

import { Styled, StyledType } from './Explorer.types';
import useToggle from '../hooks/useToggle';
import clsx from 'clsx';
interface TableFilter {
    filters?: {
        [name: string]: {
            value: any;
            matchMode: any;
        }
    },
    sortField?: string,
    sortOrder?: -1 | 1,
    first: number,
    page: number
}

const flexGrow = {flexGrow: 1};
const selectionWidth = {width: '3em'};

const Explorer: StyledType = ({
    classes,
    className,
    keyField,
    fetch,
    subscribe,
    properties,
    columns,
    resultSet,
    children,
    details,
    actions,
    filter,
    onDropdown,
    showFilter = true,
    pageSize = 10
}) => {
    const [tableFilter, setFilters] = React.useState<TableFilter>({
        filters: columns?.reduce((prev, column) => (filter?.[column] === undefined) ? prev : {...prev, [column]: {value: filter[column]}}, {}),
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

    const isEnabled = enabled => {
        if (typeof enabled !== 'string') return !!enabled;
        switch (enabled) {
            case 'current': return !!current;
            case 'selected': return selected && selected.length > 0;
            default: return false;
        }
    };

    const dropdownNames = (columns || [])
        .flat()
        .filter(Boolean)
        .map(name => lodashGet(properties, name?.replace(/\./g, '.properties.'))?.editor?.dropdown)
        .filter(Boolean);

    const buttons = React.useMemo(() => (actions || []).map(({title, action, enabled = true}, index) =>
        <Button
            key={index}
            label={title}
            onClick={() => action({
                id: current && current[keyField],
                current,
                selected
            })}
            disabled={!isEnabled(enabled)}
            className="p-mr-2"
        />
    ), [keyField, actions, current, selected]);
    React.useEffect(() => {
        async function load() {
            if (!fetch) {
                setItems([[], 0]);
                setDropdown({});
            } else {
                setLoading(true);
                try {
                    const items = await fetch({
                        [resultSet || 'filterBy']: {...filter, ...Object.entries(tableFilter.filters).reduce((prev, [name, {value}]) => ({...prev, [name]: value}), {})},
                        ...tableFilter.sortField && {
                            orderBy: [{
                                field: tableFilter.sortField,
                                dir: {[-1]: 'DESC', 1: 'ASC'}[tableFilter.sortOrder]
                            }]
                        },
                        ...pageSize && {
                            paging: {
                                pageSize,
                                pageNumber: Math.floor(tableFilter.first / pageSize) + 1
                            }
                        }
                    });
                    const records = resultSet ? items[resultSet] : items;
                    let total = items.pagination && items.pagination.recordsTotal;
                    if (total == null) {
                        total = (records && records.length) || 0;
                        if (total === pageSize) total++;
                        total = tableFilter.first + total;
                    }
                    setItems([records, total]);
                    if (onDropdown) setDropdown(await onDropdown(dropdownNames));
                } finally {
                    setLoading(false);
                }
            }
        }
        load();
        if (subscribe) {
            return subscribe(rows => {
                setItems(([items, totalRecords]) => [(Array.isArray(rows) || !keyField) ? rows : items.map(item => {
                    const update = rows[item[keyField]];
                    return update ? {...item, ...update} : item;
                }), totalRecords]);
            });
        }
    }, [fetch, tableFilter, filter, subscribe]);
    const detailsPanel = React.useMemo(() => detailsOpened && details &&
        <SplitterPanel key='details' size={10}>
            <div style={{ width: '200px' }}>{
                current && Object.entries(details).map(([name, value], index) =>
                    <div className={classes.details} key={index}>
                        <div className={classes.detailsLabel}>{value}</div>
                        <div className={classes.detailsValue}>{current[name]}</div>
                    </div>
                )
            }</div>
        </SplitterPanel>, [current, details, detailsOpened]);

    const filterBy = (name: string, value: string) => e => {
        setFilters(prev => {
            const next = {
                ...prev,
                filters: {
                    ...prev?.filters,
                    [name]: {
                        ...prev?.filters?.[name],
                        value: e[value]
                    }
                }
            };
            return next;
        });
    };

    function columnProps(name) {
        const {type, dropdown, parent, ...editor} = properties?.[name]?.editor || {name};
        const fieldName = editor.name || name;
        let filterElement, body;
        switch (type) {
            case 'boolean':
                filterElement = <Checkbox
                    checked={tableFilter?.filters?.[fieldName]?.value}
                    onChange={filterBy(fieldName, 'checked')}
                    {...editor}
                />;
                body = function body(rowData) {
                    const value = rowData[fieldName];
                    if (value == null) return null;
                    return <i className={`pi ${value ? 'pi-check' : 'pi-times'}`}></i>;
                };
                break;
            case 'dropdown':
                filterElement = <Dropdown
                    value={tableFilter?.filters?.[fieldName]?.value}
                    onChange={filterBy(fieldName, 'value')}
                    showClear={true}
                    options={dropdowns?.[dropdown] || []}
                    {...editor}
                />;
                break;
            case 'date':
                body = function body(rowData) {
                    const value = rowData[fieldName];
                    if (value == null) return null;
                    return new Date(value).toLocaleDateString();
                };
                break;
            case 'time':
                body = function body(rowData) {
                    const value = rowData[fieldName];
                    if (value == null) return null;
                    return new Date(value).toLocaleTimeString();
                };
                break;
            case 'date-time':
                body = function body(rowData) {
                    const value = rowData[fieldName];
                    if (value == null) return null;
                    return new Date(value).toLocaleString();
                };
                break;
        }
        return {...filterElement && {filterElement}, ...body && {body}};
    }

    const Columns = React.useMemo(() => columns.map(name => <Column
        key={name}
        field={name}
        header={properties[name]?.title}
        body={properties[name]?.action && (row => <Button
            label={row[name]}
            style={{padding: 0, minWidth: 'inherit'}}
            className='p-button-link'
            onClick={() => properties[name].action({
                id: row && row[keyField],
                current: row,
                selected: [row]
            })}
        />)}
        filter={showFilter && !!properties[name]?.filter}
        sortable={!!properties[name]?.sort}
        {...columnProps(name)}
    />), [columns, properties, showFilter, dropdowns, tableFilter]);
    const table = <DataTable
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
        onSelectionChange={handleSelectionChange}
        onRowSelect={handleRowSelect}
    >
        {keyField && <Column selectionMode="multiple" style={selectionWidth}/>}
        {Columns}
    </DataTable>;
    return (
        <div className={clsx('p-d-flex', 'p-flex-column', className)} style={{height: '100%'}} >
            {(detailsPanel || children) ? <>
                <Toolbar
                    left={React.useMemo(() =>
                        <>
                            {children && <Button icon="pi pi-bars" className="p-mr-2" onClick={navigationToggle}/>}
                            {buttons}
                        </>, [navigationToggle, buttons])
                    }
                    right={React.useMemo(() => <Button icon="pi pi-bars" className="p-mr-2" onClick={detailsToggle}/>, [detailsToggle])
                    }
                />
                <Splitter style={flexGrow}>
                    {[
                        children && navigationOpened && <SplitterPanel key='nav' size={15}>{children}</SplitterPanel>,
                        <SplitterPanel key='items' size={75}>
                            {table}
                        </SplitterPanel>,
                        detailsPanel
                    ].filter(Boolean)}
                </Splitter>
            </> : table}
        </div>
    );
};

export default Styled(Explorer);
