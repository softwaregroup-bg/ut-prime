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
    const [original, setOriginal] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [editingRows, setEditingRows] = React.useState({});

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

    const changeFieldValue = React.useCallback((row, field, value) => {
        const index = row[INDEX];
        if (index >= 0) {
            const updatedValue = [...allRows];
            updatedValue[index][field] = value;
            onChange(updatedValue);
        } else {
            const {$pivot, ...values} = row;
            onChange([...allRows, {...values, [field]: value}]);
        }
    }, [allRows, onChange]);

    const init = React.useCallback(({index}) => {
        const originalIndex = rows[index][INDEX];
        (originalIndex != null) && setOriginal(prev => {
            prev[originalIndex] = {...rows[index]};
            return prev;
        });
    }, [rows, setOriginal]);

    const cancel = React.useCallback(({index}) => {
        const restored = [...allRows];
        const originalIndex = rows[index][INDEX];
        if (originalIndex != null) {
            if (original[originalIndex]) {
                const {$pivot, ...values} = original[originalIndex];
                restored[originalIndex] = values;
            } else {
                restored.splice(originalIndex, 1);
            }
            onChange(restored);
            setOriginal(prev => {
                delete prev[originalIndex];
                return prev;
            });
        }
    }, [allRows, onChange, original, rows]);

    const save = React.useCallback(({index}) => {
        const originalIndex = rows[index][INDEX];
        (originalIndex != null) && setOriginal(prev => {
            delete prev[originalIndex];
            return prev;
        });
    }, [rows]);

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
            setEditingRows(prev => {
                prev[id] = true;
                return prev;
            });
            setOriginal(prev => {
                prev[updatedValue.length - 1] = {...newValue};
                return prev;
            });
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
                onRowEditInit={init}
                onRowEditCancel={cancel}
                onRowEditSave={save}
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
                        {...columnProps({name, property: properties?.[name], dropdowns, changeFieldValue})}
                    />)
                }
                {allowEdit && <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }}></Column>}
            </DataTable>
        </>
    );
});
