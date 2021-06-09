import React from 'react';
import {InputText, DataTable, Column, Toolbar, Button} from '../../prime';
import { v4 as uuidv4 } from 'uuid';

export const Table = React.forwardRef<{}, any>(({onChange, columns, value, dataKey = 'id'}, ref) => {
    if (typeof ref === 'function') ref(React.useState({})[0]);
    const cellEditor = React.useCallback((props, field) => <InputText
        type="text"
        autoFocus={props.index === 1}
        value={props.rowData[field]}
        onChange={({target: {value}}) => {
            const updatedValue = [...props.value];
            updatedValue[props.rowIndex][props.field] = value;
            onChange(updatedValue);
        }}
        id={`${props.rowData.id}`}
    />, [onChange]);
    const [original, setOriginal] = React.useState({index: null, value: null});

    const init = React.useCallback(({index}) => {
        setOriginal({index, value: {...value[index]}});
    }, [value, setOriginal]);

    const cancel = React.useCallback(() => {
        const restored = [...value];
        restored[original.index] = original.value;
        onChange(restored);
    }, [value, onChange]);
    const addNewRow = () => {
        const id = uuidv4();
        const newValue = Object.keys(value[0] || {}).reduce((item, key) => ({...item, [key]: '', id: id}), {});
        const updatedValue = [...value, newValue];
        onChange(updatedValue);
        setEditingRows({[id]: true});
    };
    const deleteRow = () => {
        onChange(value.filter(rowData => !selected.includes(rowData)));
    };
    const [selected, setSelected] = React.useState([]);
    const [editingRows, setEditingRows] = React.useState({});
    const onRowEditChange = (event) => {
        setEditingRows(event.data);
    };
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button p-mr-2" onClick={addNewRow} />
                <Button label="Delete" icon="pi pi-trash" className="p-button" onClick={deleteRow} disabled={!selected || !selected.length} />
            </React.Fragment>
        );
    };
    return (
        <>
            <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={null}></Toolbar>
            <DataTable
                value={value}
                editMode="row"
                dataKey={dataKey}
                className="editable-cells-table"
                onRowEditInit={init}
                onRowEditCancel={cancel}
                selection={selected}
                onSelectionChange={(e) => { setSelected(e.value); }}
                editingRows={editingRows}
                onRowEditChange={onRowEditChange}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                {
                    (columns || []).map(({ field, header }) => <Column
                        key={field}
                        field={field}
                        header={header}
                        editor={props => cellEditor(props, field)}
                    />)
                }
                <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </>
    );
});
