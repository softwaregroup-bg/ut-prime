import React from 'react';
import lodashGet from 'lodash.get';

import {DataTableTest, Column, Toolbar, Button} from '../../prime';
import columnProps from '../../lib/column';
import {CHANGE, INDEX, KEY, NEW} from '../const';
import type {Properties} from '../../types';

const getDefault = (key, value, rows) => {
    if (!value || !('default' in value)) return;
    const defaultValue = value.default;
    switch (defaultValue?.function) {
        case 'max':
            return [key, rows.reduce((max, row) => row ? Math.max(max, row[key]) : max, 0) + 1];
        case 'min':
            return [key, rows.reduce((min, row) => row ? Math.min(min, row[key]) : min, 0) - 1];
        default:
            return [key, defaultValue];
    }
};

const selectStyle = { width: '3rem' };
const editStyle = { width: '7rem' };
const editBodyStyle = { textAlign: 'center' };
const sameString = (a, b) => a === b || (a != null && b != null && String(a) === String(b));

const defaults = (properties : Properties, rows: {}[]) =>
    Object.fromEntries(
        Object.entries(properties)
            .map(([key, value]) => getDefault(key, value, rows)).filter(Boolean));

const handleFilter = () => {};
const backgroundNone = {background: 'none'};

const masterFilter = (master, filter) => master && Object.fromEntries(
    Object.entries(master).map(
        ([master, detail]) => [detail, filter?.[master]]
    )
);

const noRows = Object.freeze([]);

export default React.forwardRef<{}, any>(({
    name,
    id: resultSet = name,
    onChange,
    getValues,
    counter,
    widgets,
    value: allRows = noRows,
    identity,
    properties,
    dropdowns,
    parent,
    filter,
    master,
    children,
    disabled,
    autoSelect,
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
    ...props
}, ref) => {
    if (typeof ref === 'function') ref({});
    const [selected, setSelected] = React.useState(getValues ? getValues(`$.selected.${props.name}`) : null);
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

    const cancel = React.useCallback(({data}) => {
        if (data[NEW]) {
            const index = data[INDEX];
            if (index != null) {
                const changed = [...allRows];
                delete changed[index];
                onChange((Object.keys(editingRows).length <= 1) ? changed.filter(Boolean) : changed);
            }
        }
    }, [allRows, onChange, editingRows]);

    const complete = React.useCallback(({data, newData}) => {
        const changed = [...allRows];
        const originalIndex = data[INDEX];
        const {[NEW]: ignore, $pivot, [KEY]: key, [CHANGE]: change, [INDEX]: index, ...values} = newData;
        if (originalIndex != null) {
            changed[originalIndex] = values;
            onChange(changed);
        } else {
            if (identity) values[identity] = -(++counter.current);
            onChange([...changed, values]);
        }
    }, [allRows, counter, identity, onChange]);

    !keepRows && rows.forEach(row => {
        row[CHANGE] = complete;
    });

    const handleSelected = React.useCallback(event => {
        if (!allowSelect) return;
        onChange(event.value, {select: true, field: false, children: false});
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

    const leftToolbarTemplate = React.useCallback(() => {
        const addNewRow = event => {
            event.preventDefault();
            const newValue = {...filter, ...masterFilter(master, parent), ...defaults(properties, allRows), [NEW]: true};
            if (identity) newValue[identity] = -(++counter.current);
            const updatedValue = [...(allRows || []), newValue];
            onChange(updatedValue);
            setPendingEdit(prev => ({
                ...prev,
                [updatedValue.length - 1]: true
            }));
        };
        const deleteRow = event => {
            event.preventDefault();
            const remove = [].concat(selected);
            handleSelected({value: null});
            onChange(allRows.filter((rowData, index) => !remove.some(item => item[INDEX] === index)));
        };
        return (
            <React.Fragment>
                {allowAdd && <Button
                    label="Add"
                    icon="pi pi-plus"
                    className="p-button mr-2"
                    onClick={addNewRow}
                    data-testid={`${resultSet}.addButton`}
                />}
                {allowDelete && <Button
                    label="Delete"
                    icon="pi pi-trash"
                    className="p-button"
                    onClick={deleteRow}
                    disabled={!selected}
                    data-testid={`${resultSet}.saveButton`}
                />}
            </React.Fragment>
        );
    }, [allowAdd, allowDelete, selected, identity, master, filter, parent, allRows, onChange, handleSelected, counter, properties, resultSet]);

    if (selected && props.selectionMode === 'single' && !rows.includes(selected)) {
        handleSelected({value: rows[selected[KEY]]});
    }
    if (master && !parent) return null;
    return (
        <>
            {!disabled && (allowAdd || allowDelete) && <Toolbar className="p-0 border-none" left={leftToolbarTemplate} right={null} style={backgroundNone}></Toolbar>}
            <DataTableTest
                editMode='row'
                className='editable-cells-table'
                emptyMessage=''
                selection={selected}
                onSelectionChange={handleSelected}
                dataKey={KEY}
                id={resultSet}
                {...props}
                value={rows}
                onRowEditComplete={complete}
                onRowEditCancel={cancel}
                onFilter={handleFilter}
                editingRows={editingRows}
                onRowEditChange={onRowEditChange}
            >
                {allowSelect && (!props.selectionMode || props.selectionMode === 'checkbox') && <Column selectionMode="multiple" headerStyle={selectStyle}></Column>}
                {children}
                {
                    (widgets || []).map(column => {
                        const isString = typeof column === 'string';
                        const {name, ...widget} = isString ? {name: column} : column;
                        return (<Column
                            key={name}
                            {...columnProps({resultSet, name, widget: !isString && widget, property: properties?.[name], dropdowns, editable: true})}
                        />);
                    })
                }
                {allowEdit && <Column rowEditor headerStyle={editStyle} bodyStyle={editBodyStyle}></Column>}
            </DataTableTest>
        </>
    );
});
