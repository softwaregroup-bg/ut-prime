import React from 'react';
import lodashGet from 'lodash.get';

import {DataTable, Column, Toolbar, Button} from '../../prime';
import columnProps from '../../lib/column';
import {CHANGE, INDEX, KEY} from '../const';
import type {Properties} from '../../types';

const getDefault = (key, value, rows) => {
    if (!value || !('default' in value)) return;
    const defaultValue = value.default;
    switch (defaultValue?.function) {
        case 'max':
            return [key, rows.reduce((max, row) => Math.max(max, row[key]), 0) + 1];
        case 'min':
            return [key, rows.reduce((min, row) => Math.min(min, row[key]), 0) - 1];
        default:
            return [key, defaultValue];
    }
};

const defaults = (properties : Properties, rows: {}[]) =>
    Object.fromEntries(
        Object.entries(properties)
            .map(([key, value]) => getDefault(key, value, rows)).filter(Boolean));

const handleFilter = () => {};
const backgroundNone = {background: 'none'};

const complete = ({data, newData}) => {
    data[CHANGE]?.(data, newData);
};

const masterFilter = (master, filter) => master && Object.fromEntries(
    Object.entries(master).map(
        ([master, detail]) => [detail, filter?.[master]]
    )
);

const noRows = Object.freeze([]);

export default React.forwardRef<{}, any>(({
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
    pivot: {
        dropdown = '',
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
    const [selected, setSelected] = React.useState(getValues(`$.selected.${props.name}`));
    const [editingRows, setEditingRows] = React.useState({});
    const [pendingEdit, setPendingEdit] = React.useState(null);

    const rows = React.useMemo(() => {
        const keys = Object.entries(join || {});
        const joined = (pivotRows?.length && keys.length) ? pivotRows.map($pivot => {
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
        }) : allRows?.map((item, index) => ({...item, [INDEX]: index})) || [];
        const filterFields = Object.entries({...filter, ...masterFilter(master, parent)});
        return joined?.filter(row => filterFields.every(([name, value]) => lodashGet(row, name) === value));
    }, [allRows, parent, master, pivotRows, join, filter]);

    rows.forEach((row, index) => {
        row[KEY] = index;
        row[CHANGE] = function change(row, newData) {
            const changed = [...allRows];
            const originalIndex = row[INDEX];
            const {$pivot, [KEY]: key, [INDEX]: index, ...values} = newData;
            if (originalIndex != null) {
                changed[originalIndex] = values;
                onChange(changed);
            } else {
                if (identity) values[identity] = -(++counter.current);
                onChange([...changed, values]);
            }
        };
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
            const lastEditing = rows.find((_, index) => pendingEdit[index]);
            if (lastEditing) handleSelected({value: lastEditing});
        }
    }, [handleSelected, onChange, pendingEdit, rows]);

    const onRowEditChange = React.useCallback(event => {
        setEditingRows(event.data);
    }, [setEditingRows]);

    const leftToolbarTemplate = React.useCallback(() => {
        const addNewRow = event => {
            event.preventDefault();
            const newValue = {...filter, ...masterFilter(master, parent), ...defaults(properties, allRows)};
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
                {allowAdd && <Button label="Add" icon="pi pi-plus" className="p-button mr-2" onClick={addNewRow} />}
                {allowDelete && <Button label="Delete" icon="pi pi-trash" className="p-button" onClick={deleteRow} disabled={!selected} />}
            </React.Fragment>
        );
    }, [allowAdd, allowDelete, selected, identity, master, filter, parent, allRows, onChange, handleSelected, counter, properties]);

    if (selected && props.selectionMode === 'single' && !rows.includes(selected)) {
        handleSelected({value: rows[selected[KEY]]});
    }
    if (master && !parent) return null;
    return (
        <>
            {!disabled && (allowAdd || allowDelete) && <Toolbar className="p-0" left={leftToolbarTemplate} right={null} style={backgroundNone}></Toolbar>}
            <DataTable
                editMode='row'
                className='editable-cells-table'
                emptyMessage=''
                selection={selected}
                onSelectionChange={handleSelected}
                {...props}
                value={rows}
                dataKey={KEY}
                onRowEditComplete={complete}
                onFilter={handleFilter}
                editingRows={editingRows}
                onRowEditChange={onRowEditChange}
            >
                {allowSelect && (!props.selectionMode || props.selectionMode === 'checkbox') && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>}
                {children}
                {
                    (widgets || []).map(column => {
                        const isString = typeof column === 'string';
                        const {name, ...widget} = isString ? {name: column} : column;
                        return (<Column
                            key={name}
                            {...columnProps({name, widget: !isString && widget, property: properties?.[name], dropdowns, editable: true})}
                        />);
                    })
                }
                {allowEdit && <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }}></Column>}
            </DataTable>
        </>
    );
});
