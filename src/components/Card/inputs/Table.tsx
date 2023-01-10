import React from 'react';
import lodashGet from 'lodash.get';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';

import {DataTable, Column, Toolbar, Button, type DataTableProps} from '../../prime';
import Text from '../../Text';
import columnProps from '../../lib/column';
import useFilter from '../../hooks/useFilter';
import {CHANGE, INDEX, KEY, NEW} from '../const';
import type {Properties, WidgetReference, PropertyEditor} from '../../types';
import testid from '../../lib/testid';
import ActionButton from '../../ActionButton';
import prepareSubmit from '../../lib/prepareSubmit';

const fieldName = column => typeof column === 'string' ? column : column.name;

const getDefault = (key, value, rows) => {
    if (!value || !('default' in value)) return;
    const defaultValue = value.default;
    switch (defaultValue?.function) {
        case 'max':
            return [key, rows.reduce((max, row) => row ? Math.max(max, row[key]) : max, 0) + 1];
        case 'min':
            return [key, rows.reduce((min, row) => row ? Math.min(min, row[key]) : min, 0) - 1];
        case 'dateNow':
            return [key, new Date().toLocaleDateString()];
        case 'timeNow':
            return [key, new Date().toLocaleTimeString()];
        case 'datetimeNow':
            return [key, new Date().toLocaleString()];
        default:
            return [key, defaultValue];
    }
};

const editStyle = { width: '7rem' };
const editBodyStyle: React.CSSProperties = { textAlign: 'center' };
const sameString = (a, b) => a === b || (a != null && b != null && String(a) === String(b));

const defaults = (properties : Properties, rows: readonly object[]) =>
    Object.fromEntries(
        Object.entries(properties)
            .map(([key, value]) => getDefault(key, value, rows)).filter(Boolean));

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
    filter?: object;
    master?: unknown;
    children?: unknown;
    autoSelect?: unknown;
    selectionPath?: unknown;
    label?: unknown;
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
        allowArchive = !pivotRows?.length,
        allowEdit = true,
        allowSelect = true
    } = {},
    ...props
}, ref) {
    if (typeof ref === 'function') ref({});
    const classes = useStyles();
    const [selected, setSelected] = React.useState(getValues ? getValues(`${selectionPath}.${name}`) : null);
    const [editingRows, setEditingRows] = React.useState({});
    const [pendingEdit, setPendingEdit] = React.useState(null);
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

    const [loading, setLoading] = React.useState('');
    const submit = React.useCallback(async({method, params}, form?) => {
        params = prepareSubmit([getValues(form?.params), {}, {method, params}]);
        delete params?.$;
        setLoading('loading');
        try {
            await methods[method](params);
        } finally {
            setLoading('');
        }
    }, [methods, getValues]);

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

    const buttons = React.useMemo(() => (props?.additionalButtons || []).map((widget, index) => {
        const {title, icon, permission, method, confirm} = (typeof widget === 'string') ? properties[widget].widget : widget;
        return <ActionButton
            key={index}
            icon={icon}
            permission={permission}
            {...testid(`${permission ? (permission + 'Button') : ('button' + index)}`)}
            submit={submit}
            method={method}
            confirm={confirm}
            getValues={getValues}
            disabled={!selected || !!loading}
            aria-label='archive'
            className='p-button mr-2'
            {...testid(title + 'Button')}
        >{title}</ActionButton>;
    }
    ), [props?.additionalButtons, properties, submit, getValues, selected, loading]);

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
        // rows?.filter(item => !item?.[NEW]).length > 1
        rows.length > 1
    );

    const leftToolbarTemplate = React.useCallback(() => {
        const addNewRow = event => {
            event.preventDefault();
            const newValue = {...filter, ...masterFilter(master, parent), ...defaults(properties, allRows), [NEW]: true};
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
        const archiveRow = event => {
            event.preventDefault();
            const archive = [].concat(selected);
            const updatedValue = allRows.map(row => {
                if (archive.some(item => item.name === row.name)) {
                    return {...row, name: 'documentTest123'};
                }
                return row;
            });
            handleSelected({value: updatedValue});
            onChange({...event, value: updatedValue});
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
                    className="p-button mr-2"
                    onClick={deleteRow}
                    disabled={!selected}
                    {...testid(`${resultSet}.deleteButton`)}
                >Delete</Button>}
                {props?.additionalButtons && buttons}
                {allowArchive && !disabled && <Button
                    label=' '
                    aria-label='Test'
                    icon="pi pi-inbox"
                    className="p-button"
                    onClick={archiveRow}
                    disabled={!selected}
                    {...testid(`${resultSet}.testButton`)}
                >Test</Button>}
            </React.Fragment>
        );
    }, [allowAdd, allowDelete, selected, identity, master, filter, parent, allRows, onChange, handleSelected, counter, properties, resultSet, disabled, allowArchive, props?.additionalButtons, buttons, setFilters, initialFilters]);

    if (selected && props.selectionMode === 'single' && !rows.includes(selected)) {
        handleSelected({value: rows[selected[KEY]]});
    }
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
                                tableFilter
                            })}
                        />);
                    })
                }
                {allowEdit && <Column rowEditor headerStyle={editStyle} bodyStyle={editBodyStyle}></Column>}
            </DataTable>
        </>
    );
});
