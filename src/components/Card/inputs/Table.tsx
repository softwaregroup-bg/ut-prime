import React from 'react';
import lodashGet from 'lodash.get';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';
import merge from 'ut-function.merge';

import {DataTable, Column, Toolbar, Button, type DataTableProps} from '../../prime';
import Text from '../../Text';
import Context from '../../Text/context';
import columnProps from '../../lib/column';
import useFilter from '../../hooks/useFilter';
import {CHANGE, INDEX, KEY, NEW} from '../const';
import type {Properties, WidgetReference, PropertyEditor, FormApi} from '../../types';
import prepareSubmit from '../../lib/prepareSubmit';
import testid from '../../lib/testid';
import useButtons from '../../hooks/useButtons';

const fieldName = column => typeof column === 'string' ? column : column.name;

const getDefault = (key, value, rows, formatValue, formatOptions) => {
    if (!value || !('default' in value)) return;
    const defaultValue = value.default;
    switch (defaultValue?.function) {
        case 'max':
            return [key, rows.reduce((max, row) => row ? Math.max(max, row[key]) : max, 0) + 1];
        case 'min':
            return [key, rows.reduce((min, row) => row ? Math.min(min, row[key]) : min, 0) - 1];
        case 'dateNow':
            return [key, formatValue(new Date(), formatOptions?.date)];
        case 'timeNow':
            return [key, formatValue(new Date(), formatOptions?.time)];
        case 'datetimeNow':
            return [key, formatValue(new Date(), formatOptions?.dateTime)];
        default:
            return [key, defaultValue];
    }
};

const editStyle = { width: '7rem' };
const editBodyStyle: React.CSSProperties = { textAlign: 'center' };
const sameString = (a, b) => a === b || (a != null && b != null && String(a) === String(b));

const defaults = (properties : Properties, rows: readonly object[], formatValue: (value: number | Date, options: object) => string, formatOptions: object) =>
    Object.fromEntries(
        Object.entries(properties)
            .map(([key, value]) => getDefault(key, value, rows, formatValue, formatOptions)).filter(Boolean));

const backgroundNone = {background: 'none'};

const masterFilter = (master, filter) => master && Object.fromEntries(
    Object.entries(master).map(
        ([master, detail]) => [detail, filter?.[master]]
    )
);

const noRows = Object.freeze([]);
const radioColumns = Object.freeze(['radio', 'select-table-radio']);

const useStyles = createUseStyles({
    table: {
        '& .p-datatable-wrapper': {
            overflowX: 'auto',
            '& th': {
                minWidth: '3rem',
                position: 'relative',
                '&.p-selection-column': {
                    flexGrow: 0,
                    width: '3rem'
                }
            },
            '& td': {
                minWidth: '3rem'
            }
        }
    },
    current: {
        outline: '0.15rem solid var(--primary-color)',
        outlineOffset: '-0.15rem'
    }
});

interface TableProps extends Omit<DataTableProps, 'onChange'> {
    name: string;
    id?: string;
    onChange: (event: {value: []}, flags?: {select: boolean, field: boolean, children: boolean}) => void;
    getValues?: (field: string) => unknown;
    counter?: {current: number};
    widgets?: WidgetReference[];
    value: object[];
    identity?: string;
    properties: Properties;
    dropdowns?: object;
    parent?: unknown;
    methods?: object;
    filter?: object;
    master?: unknown;
    children?: unknown;
    autoSelect?: unknown;
    selectionPath?: unknown;
    label?: unknown;
    formApi?: FormApi,
    pivot?: {
        dropdown?: string;
        master?: object;
        examples?: object[];
        join?: object;
    };
    actions?: {
        allowAdd?: boolean;
        allowDelete?: boolean;
        allowEdit?: boolean;
        allowSelect?: boolean;
    };
    toolbar?: false | WidgetReference[];
    formatOptions?: {
        date?: object;
        dateTime?: object;
        time?: object;
    }
}

export default React.forwardRef<object, TableProps>(function Table({
    name,
    id: resultSet = name,
    onChange,
    getValues,
    counter,
    hidden,
    widgets,
    value: allRows = noRows,
    identity,
    properties,
    dropdowns,
    methods,
    parent,
    filter,
    master,
    children,
    disabled,
    autoSelect,
    selectionPath = '$.selected',
    label,
    pivot: {
        dropdown = '',
        master: pivotMaster = null,
        examples: pivotRows = (dropdown && dropdowns?.[dropdown]),
        join = null
    } = {},
    actions: {
        allowAdd = !pivotRows?.length,
        allowDelete = !pivotRows?.length,
        allowEdit = true,
        allowSelect = true
    } = {},
    toolbar,
    formApi,
    formatOptions = {time: { fn: 'datefns', format: 'HH:mm:ss' }, date: { fn: 'datefns', format: 'dd-MM-yyyy' }, dateTime: {fn: 'datefns', format: 'dd-MM-yyyy HH:mm:ss' }},
    ...props
}, ref) {
    if (typeof ref === 'function') ref({});
    const classes = useStyles();
    const [selected, setSelected] = React.useState(getValues ? getValues(`${selectionPath}.${name}`) : null);
    const [editingRows, setEditingRows] = React.useState({});
    const [pendingEdit, setPendingEdit] = React.useState(null);
    const ctx = React.useContext(Context);
    const keepRows = !!props.selection;

    const rows = React.useMemo(() => {
        const keys = Object.entries(join || {});
        let pivotRowsFiltered = pivotRows;
        if (pivotRowsFiltered?.length && pivotMaster) {
            const pivotFilterFields = Object.entries({...filter, ...masterFilter(pivotMaster, parent)});
            pivotRowsFiltered = pivotRows.filter(row => pivotFilterFields.every(([name, value]) => sameString(lodashGet(row, name), value)));
        }
        const joined = keepRows
            ? allRows
            : (pivotRows?.length && keys.length)
                ? pivotRowsFiltered.map($pivot => {
                    const found = allRows.findIndex(row => keys.every(([pivotKey, rowKey]: [string, string]) => $pivot[pivotKey] === row[rowKey]));
                    return found >= 0 ? {
                        ...allRows[found],
                        [INDEX]: found,
                        $pivot
                    } : {
                        ...master && Object.fromEntries(Object.entries(master).map(([masterKey, rowKey]) => [rowKey, parent[masterKey]])),
                        ...Object.fromEntries(keys.map(([pivotKey, rowKey]) => [rowKey, $pivot[pivotKey]])),
                        $pivot
                    };
                }).map((item, index) => item && {
                    ...item,
                    [KEY]: index
                })
                : allRows?.map((item, index) => item && {
                    ...item,
                    [INDEX]: index,
                    [KEY]: index
                }) || [];
        const filterFields = Object.entries({...filter, ...masterFilter(master, parent)});
        return joined?.filter(row => row && filterFields.every(([name, value]) => sameString(lodashGet(row, name), value)));
    }, [allRows, parent, master, pivotRows, join, filter, keepRows, pivotMaster]);

    const cancel = React.useCallback(event => {
        if (event.data[NEW]) {
            const index = event.data[INDEX];
            if (index != null) {
                const changed = [...allRows];
                delete changed[index];
                onChange({...event, value: (Object.keys(editingRows).length <= 1) ? changed.filter(Boolean) : changed});
            }
        }
    }, [allRows, onChange, editingRows]);

    const complete = React.useCallback(event => {
        const changed = [...allRows];
        const originalIndex = event.data[INDEX];
        const {[NEW]: ignore, $pivot, [KEY]: key, [CHANGE]: change, [INDEX]: index, ...values} = event.newData;
        for (const [key, value] of Object.entries(properties)) {
            if (!radioColumns.includes((value as {widget?: {type?: string}})?.widget?.type) || !values[key]) continue;
            for (let id = 0; id < changed.length; id++) {
                if (!changed[id][key]) continue;
                if (id !== originalIndex) changed[id][key] = false;
                else changed[id][key] = event.newData[key];
            }
        }
        if (currentRef.current?.[KEY] === key) currentRef.current = event.newData;
        if (originalIndex != null) {
            changed[originalIndex] = values;
            onChange({...event, value: changed});
        } else {
            if (identity) values[identity] = -(++counter.current);
            onChange({...event, value: [...changed, values]});
        }
    }, [allRows, counter, identity, onChange, properties]);

    !keepRows && rows.forEach(row => {
        row[CHANGE] = complete;
    });

    const handleSelected = React.useCallback(event => {
        if (!allowSelect) return;
        onChange(event, {select: true, field: false, children: false});
        setSelected(event.value);
    }, [allowSelect, onChange]);

    React.useEffect(() => {
        if (pendingEdit) {
            setPendingEdit(null);
            setEditingRows(prev => ({
                ...prev,
                ...pendingEdit
            }));
            if (autoSelect) {
                const lastEditing = rows.find(row => row && pendingEdit[row[KEY]]);
                if (lastEditing) handleSelected({value: props.selectionMode === 'single' ? lastEditing : [lastEditing]});
            }
        }
    }, [handleSelected, onChange, pendingEdit, rows, props.selectionMode, autoSelect]);

    const onRowEditChange = React.useCallback(event => {
        setEditingRows(event.data);
    }, [setEditingRows]);
    const initialFilters = React.useMemo(() => ({
        filters: (widgets || []).reduce((prev : object, column) => {
            let field = fieldName(column);
            const value = lodashGet({}, field);
            field = field.split('.').pop();
            return (value === undefined) ? {...prev, [field]: {matchMode: 'contains'}} : {...prev, [field]: {value, matchMode: 'contains'}};
        }, {}),
        first: 0,
        page: 1
    }), [widgets]);

    const [tableFilter, setFilters, filterBy, filterProps] = useFilter(
        initialFilters,
        widgets,
        properties,
        rows?.filter(item => !item?.[NEW]).length > 1
    );

    const [loading, setLoading] = React.useState('');
    const currentRef = React.useRef(null);
    const handleRowUnselect = React.useCallback(e => { currentRef.current = null; }, []);
    const submit = React.useCallback(async({method, params}) => {
        const row = {...currentRef.current};
        delete row[KEY];
        delete row[CHANGE];
        delete row[INDEX];
        delete row[NEW];
        params = prepareSubmit([row, {}, {method, params}]);
        setLoading('loading');
        try {
            currentRef.current[CHANGE]({
                data: {...currentRef.current},
                newData: merge(currentRef.current, await methods[method](params))
            });
        } finally {
            setLoading('');
        }
    }, [methods]);

    const get = React.useMemo(() => ({$ = undefined, ...params} = {}) => ({
        params,
        id: currentRef.current && currentRef.current[KEY],
        current: currentRef.current,
        form: formApi,
        selected: [].concat(selected),
        filter: Object.entries(tableFilter.filters).reduce((prev, [name, {value}]) => ({...prev, [name]: value}), {})
    }), [selected, tableFilter.filters, formApi]);

    const buttons = useButtons({
        selected: [].concat(selected),
        current: currentRef.current,
        toolbar,
        properties,
        getValues: get,
        loading,
        submit
    });

    const handleRowSelect = React.useCallback(e => {
        if (buttons) currentRef.current = e.data;
    }, [buttons]);

    const leftToolbarTemplate = React.useCallback(() => {
        const addNewRow = event => {
            event.preventDefault();
            const newValue = {...filter, ...masterFilter(master, parent), ...defaults(properties, allRows, ctx.formatValue, formatOptions), [NEW]: true};
            if (identity) newValue[identity] = -(++counter.current);
            const updatedValue = [...(allRows || []), newValue];
            onChange({...event, value: updatedValue});
            setPendingEdit(prev => ({
                ...prev,
                [updatedValue.length - 1]: true
            }));
            setFilters(initialFilters);
        };
        const deleteRow = event => {
            event.preventDefault();
            const remove = [].concat(selected);
            handleSelected({value: null});
            onChange({...event, value: allRows.filter((rowData, index) => !remove.some(item => item[INDEX] === index))});
            setFilters(initialFilters);
        };
        return (
            <React.Fragment>
                {allowAdd && !disabled && <Button
                    label=' '
                    aria-label='Add'
                    icon="pi pi-plus"
                    className="p-button mr-2"
                    onClick={addNewRow}
                    {...testid(`${resultSet}.addButton`)}
                >Add</Button>}
                {allowDelete && !disabled && <Button
                    label=' '
                    aria-label='Delete'
                    icon="pi pi-trash"
                    className={clsx('p-button', buttons && 'mr-2')}
                    onClick={deleteRow}
                    disabled={!selected}
                    {...testid(`${resultSet}.deleteButton`)}
                >Delete</Button>}
                {buttons}
            </React.Fragment>
        );
    }, [
        allowAdd,
        allowDelete,
        selected,
        identity,
        master,
        filter,
        parent,
        allRows,
        onChange,
        handleSelected,
        counter,
        properties,
        resultSet,
        disabled,
        initialFilters,
        setFilters,
        buttons,
        ctx.formatValue,
        formatOptions
    ]);

    if (selected && props.selectionMode === 'single' && !rows.includes(selected)) {
        handleSelected({value: rows[selected[KEY]]});
    }

    const rowClass = React.useCallback(
        (data: object) => currentRef.current && (data?.[KEY] === currentRef.current?.[KEY]) ? classes.current : undefined,
        [classes]
    );

    if (master && !parent) return null;
    const {left, right} = label ? {
        left: <span className='p-card-title'><Text>{label}</Text></span>,
        right: leftToolbarTemplate
    } : {
        left: leftToolbarTemplate,
        right: null
    };

    return (
        <>
            {(allowAdd || allowDelete || buttons) && <Toolbar className="p-0 border-none" left={left} right={right} style={backgroundNone}></Toolbar>}
            <DataTable
                editMode='row'
                selection={selected}
                onSelectionChange={handleSelected}
                onRowSelect={handleRowSelect}
                onRowUnselect={handleRowUnselect}
                rowClassName={rowClass}
                dataKey={KEY}
                id={resultSet}
                size='small'
                {...testid(resultSet)}
                {...filterProps}
                {...props}
                className={clsx(props.className, classes.table)}
                value={rows}
                onRowEditComplete={complete}
                onRowEditCancel={cancel}
                editingRows={editingRows}
                onRowEditChange={onRowEditChange}
            >
                {allowSelect && (!props.selectionMode || props.selectionMode === 'checkbox') && <Column selectionMode="multiple"></Column>}
                {children}
                {
                    (widgets || []).map((column, index) => {
                        const isString = typeof column === 'string';
                        const {name, ...widget} = isString ? {name: column} : column;
                        return (<Column
                            key={name}
                            filter={!!properties?.[name]?.filter}
                            sortable={!!properties?.[name]?.sort}
                            {...columnProps({
                                getValues,
                                resultSet,
                                index,
                                name,
                                widget: !isString && widget as PropertyEditor,
                                property: properties?.[name],
                                dropdowns,
                                editable: true,
                                filterBy,
                                tableFilter,
                                ctx
                            })}
                        />);
                    })
                }
                {allowEdit && !disabled && <Column rowEditor headerStyle={editStyle} bodyStyle={editBodyStyle}></Column>}
            </DataTable>
        </>
    );
});
