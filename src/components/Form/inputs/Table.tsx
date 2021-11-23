import { v4 as uuid } from 'uuid';
import React from 'react';
import lodashGet from 'lodash.get';

import {DataTable, Column, Toolbar, Button} from '../../prime';
import columnProps from '../../lib/column';

const handleFilter = () => {};
const INDEX = Symbol('index');
const backgroundNone = {background: 'none'};

const masterFilter = (master, filter) => master && Object.fromEntries(
    Object.entries(master).map(
        ([master, detail]) => [detail, filter?.[master]]
    )
);

const noRows = Object.freeze([]);

export default React.forwardRef<{}, any>(({
    onChange,
    widgets,
    value: allRows = noRows,
    dataKey = 'id',
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
        allowSelect = !pivotRows?.length
    } = {},
    ...props
}, ref) => {
    if (typeof ref === 'function') ref({});
    const [selected, setSelected] = React.useState(null);
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
                ...Object.fromEntries(keys.map(([pivotKey, rowKey]) => [rowKey, $pivot[pivotKey]])),
                $pivot
            };
        }) : allRows?.map((item, index) => ({[INDEX]: index, ...item})) || [];
        const filterFields = Object.entries({...filter, ...masterFilter(master, parent)});
        return joined?.filter(row => filterFields.every(([name, value]) => lodashGet(row, name) === value));
    }, [allRows, parent, master, pivotRows, join, filter]);

    React.useEffect(() => {
        if (pendingEdit) {
            setPendingEdit(null);
            setEditingRows(prev => ({
                ...prev,
                ...pendingEdit
            }));
        }
    }, [pendingEdit]);

    const complete = React.useCallback(({index, newData}) => {
        const changed = [...allRows];
        const originalIndex = rows[index][INDEX];
        const {$pivot, ...values} = newData;
        if (originalIndex != null) {
            changed[originalIndex] = values;
            onChange(changed);
        } else {
            onChange([...changed, values]);
        }
    }, [allRows, onChange, rows]);

    const handleSelected = React.useCallback(event => {
        if (!allowSelect) return;
        onChange(event.value, {select: true, field: false, children: false});
        setSelected(event.value);
    }, [allowSelect, onChange]);

    const onRowEditChange = React.useCallback(event => {
        setEditingRows(event.data);
    }, []);

    const leftToolbarTemplate = React.useCallback(() => {
        const addNewRow = event => {
            event.preventDefault();
            const id = uuid();
            const newValue = {[dataKey]: id, ...filter, ...masterFilter(master, parent)};
            if (master) newValue[INDEX] = allRows?.length || 0;
            const updatedValue = [...(allRows || []), newValue];
            onChange(updatedValue);
            setPendingEdit(prev => ({
                ...prev,
                [id]: true
            }));
        };
        const deleteRow = event => {
            event.preventDefault();
            const remove = [].concat(selected);
            handleSelected({value: null});
            onChange(allRows.filter((rowData, index) => master ? !remove.some(item => item[INDEX] === index) : !remove.includes(rowData)));
        };
        return (
            <React.Fragment>
                {allowAdd && <Button label="Add" icon="pi pi-plus" className="p-button mr-2" onClick={addNewRow} />}
                {allowDelete && <Button label="Delete" icon="pi pi-trash" className="p-button" onClick={deleteRow} disabled={!selected} />}
            </React.Fragment>
        );
    }, [allowAdd, allowDelete, selected, dataKey, master, filter, parent, allRows, onChange, handleSelected]);

    if (selected && props.selectionMode === 'single' && !rows.includes(selected)) {
        handleSelected({value: null});
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
                dataKey={dataKey}
                onRowEditComplete={complete}
                onFilter={handleFilter}
                editingRows={editingRows}
                onRowEditChange={onRowEditChange}
            >
                {allowSelect && (!props.selectionMode || props.selectionMode === 'checkbox') && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>}
                {children}
                {
                    (widgets || []).map(name => <Column
                        key={name}
                        field={name}
                        header={properties?.[name]?.title || name}
                        {...columnProps({name, property: properties?.[name], dropdowns})}
                    />)
                }
                {allowEdit && <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }}></Column>}
            </DataTable>
        </>
    );
});
