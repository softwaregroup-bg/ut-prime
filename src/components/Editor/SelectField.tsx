import React from 'react';
import { Dialog, Button, Tree } from '../prime';
import type {Schema} from '../types';

const fields = (schema: Schema, path: string[]) => {
    const children = schema.properties ? Object.keys(schema.properties).map(key => fields(schema.properties[key], [...path, key])) : undefined;
    children?.sort((item1, item2) => (item1.children ? 1 : 0) - (item2.children ? 1 : 0));
    return path.length ? {
        key: path.join('.'),
        label: schema.title || path[path.length - 1],
        selectable: !children,
        children
    } : (children || []);
};

interface SelectProps {
    visible: boolean;
    onSelect: (items: string[]) => void;
    onHide: () => void;
    schema: Schema;
}

export default function Select({visible, onHide, onSelect, schema}: SelectProps) {
    const [selectedKey, setSelectedKey] = React.useState(null);
    const value = React.useMemo(() => fields(schema, []), [schema]);
    const close = React.useCallback(() => {
        setSelectedKey(null);
        onHide();
    }, [onHide]);
    return <Dialog
        visible={visible}
        onHide={close}
        header='Select fields to add'
        modal
    >
        <Tree
            value={value}
            expandedKeys={Object.fromEntries(value.map(({key}) => [key, true]))}
            selectionMode='checkbox'
            selectionKeys={selectedKey}
            onSelectionChange={e => setSelectedKey(e.value)}
        />
        <Button label="Add" icon="pi pi-check" autoFocus onClick={() => {
            onSelect(
                Object
                    .entries(selectedKey)
                    .filter(([, item] : [string, {checked: boolean}]) => item.checked)
                    .map(([name]) => name)
            );
            close();
        }}
        />
        <Button label="Cancel" icon="pi pi-times" onClick={close} className="p-button-text" />
    </Dialog>;
}
