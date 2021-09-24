import { v4 as uuid } from 'uuid';
import React from 'react';

import {InputText, DataTable, Column, Toolbar, Button} from '../../prime';
import columnProps from '../../lib/column';

const handleFilter = () => {};
const INDEX = Symbol('index');

const rowsFilter = (master, filter) => master && Object.fromEntries(
    Object.entries(master).map(
        ([master, detail]) => [detail, filter?.[master]]
    )
);

export default React.forwardRef<{}, any>(({
    onChange,
    columns,
    value: allRows,
    dataKey = 'id',
    properties,
    dropdowns,
    filter: {parent: filter = false} = {},
    master,
    actions: {
        allowAdd = true,
        allowDelete = true,
        allowEdit = true,
        allowSelect = true
    } = {},
    ...props
}, ref) => {
    if (typeof ref === 'function') ref({});
    const [original, setOriginal] = React.useState({index: null, value: null});
    const [selected, setSelected] = React.useState(null);
    const [editingRows, setEditingRows] = React.useState({});

    const rows = React.useMemo(() => master
        ? allRows
            ?.map((item, index) => ({[INDEX]: index, ...item}))
            ?.filter(row => Object.entries(rowsFilter(master, filter)).every(([name, value]) => row?.[name] === value))
        : allRows, [allRows, filter, master]);

    const cellEditor = React.useCallback((props, field) => <InputText
        type="text"
        autoFocus={props.index === 1}
        value={props.rowData[field]}
        onChange={({target: {value}}) => {
            const updatedValue = [...allRows];
            updatedValue[master ? props.rowData[INDEX] : props.rowIndex][props.field] = value;
            onChange(updatedValue);
        }}
        className='w-full'
        id={`${props.rowData.id}`}
        {...properties?.[field].editor}
    />, [properties, allRows, master, onChange]);

    const init = React.useCallback(({index}) => {
        setOriginal({
            index: master ? rows[index][INDEX] : index,
            value: {...rows[index]}
        });
    }, [rows, setOriginal, master]);

    const cancel = React.useCallback(() => {
        const restored = [...allRows];
        restored[original.index] = original.value;
        onChange(restored);
    }, [allRows, onChange, original.index, original.value]);

    const handleSelected = React.useCallback(event => {
        if (!allowSelect) return;
        onChange(event.value, 'select');
        setSelected(event.value);
    }, [allowSelect, onChange]);

    const onRowEditChange = React.useCallback(event => {
        setEditingRows(event.data);
    }, []);

    const leftToolbarTemplate = React.useCallback(() => {
        const addNewRow = event => {
            event.preventDefault();
            const id = uuid();
            const newValue = {[dataKey]: id, ...rowsFilter(master, filter)};
            const updatedValue = [...(allRows || []), newValue];
            onChange(updatedValue);
            setEditingRows({[id]: true});
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
    }, [allowAdd, allowDelete, selected, dataKey, master, filter, allRows, onChange, handleSelected]);

    if (selected && !rows.includes(selected)) {
        handleSelected({value: null});
    }
    if (master && !filter) return null;
    return (
        <>
            <Toolbar className="p-0" left={leftToolbarTemplate} right={null}></Toolbar>
            <DataTable
                selectionMode='checkbox'
                editMode='row'
                className='editable-cells-table'
                emptyMessage=''
                {...props}
                value={rows}
                dataKey={dataKey}
                onRowEditInit={init}
                onRowEditCancel={cancel}
                selection={selected}
                onFilter={handleFilter}
                onSelectionChange={handleSelected}
                editingRows={editingRows}
                onRowEditChange={onRowEditChange}
            >
                {allowSelect && !props.selectionMode && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>}
                {
                    (columns || []).map(name => <Column
                        key={name}
                        field={name}
                        header={properties?.[name]?.title || name}
                        editor={props => cellEditor(props, name)}
                        {...columnProps({name, properties, dropdowns, onChange})}
                    />)
                }
                {allowEdit && <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }}></Column>}
            </DataTable>
        </>
    );
});
