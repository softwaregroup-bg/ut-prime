import React from 'react';
import lodashSet from 'lodash.set';
import lodashGet from 'lodash.get';

import { Dialog, Button, Tree, InputText } from '../prime';
import type {Schema} from '../types';

const INPUT = Symbol('input');

const fields = (schema: Schema, path: string[], edit) => {
    let children = schema.properties ? Object.keys(schema.properties).map(key => fields(schema.properties[key], [...path, key], edit)) : undefined;
    children?.sort((item1, item2) => item1.label === item2.label ? 0 : item1.label < item2.label ? -1 : 1);
    if (edit && edit === path.join('.')) {
        children ||= [];
        children.push({data: {type: INPUT}, selectable: false, key: '*' });
    }
    return path.length ? {
        key: path.join('.'),
        label: schema.title || path[path.length - 1],
        selectable: !children && (schema?.type !== 'object'),
        data: schema,
        children
    } : (children || []);
};

interface SelectProps {
    visible: boolean;
    onSelect: (items: string[]) => void;
    onHide: () => void;
    schema: Schema;
    setCustomization: (params: object) => void
}

export default function Select({visible, onHide, onSelect, schema, setCustomization}: SelectProps) {
    const [selectedKey, setSelectedKey] = React.useState({});
    const [edit, setEdit] = React.useState('');
    const [properties, setProperties] = React.useState('');
    const value = React.useMemo(() => fields(schema, [], edit), [schema, edit]);
    const template = React.useMemo(() => function template(node, options) {
        switch (node?.data?.type) {
            case INPUT:
                return <>
                    <InputText autoFocus value={properties} onChange={e => setProperties(e.target.value || null)}/>
                    <Button className='ml-2' icon='pi pi-check' onClick={() => {
                        if (properties) {
                            setCustomization(prev => ({
                                ...prev,
                                schema: {
                                    ...lodashSet(
                                        prev.schema,
                                    `properties.${edit.split('.').join('.properties.')}`,
                                    {
                                        properties: {
                                            ...Object.fromEntries(properties.split(',').map(name => [name, {}])),
                                            ...lodashGet(prev.schema, `properties.${edit.split('.').join('.properties.')}.properties`)
                                        }
                                    }
                                    )
                                }
                            }));
                            setEdit('');
                            setProperties('');
                        }
                    }}
                    />
                    <Button className='ml-2' icon='pi pi-times' onClick={() => setEdit('')}/>
                </>;
            default:
                return node?.data?.udf ? <>
                    <span className='flex-grow-1'>{node.label}</span>
                    <Button icon='pi pi-plus' onClick={() => {
                        setEdit(node.key);
                        setExpandedKeys(prev => ({...prev, [node.key]: true}));
                    }}
                    />
                </> : node.label;
        }
    }, [setEdit, properties, edit, setCustomization]);
    const close = React.useCallback(() => {
        setSelectedKey({});
        setEdit('');
        setProperties('');
        onHide();
    }, [onHide]);
    const [expandedKeys, setExpandedKeys] = React.useState(Object.fromEntries(value.map(({key}) => [key, true])));
    return <Dialog
        className='w-30rem'
        visible={visible}
        onHide={close}
        header='Select fields to add'
        modal
    >
        <Tree
            value={value}
            expandedKeys={expandedKeys}
            onToggle={e => setExpandedKeys(e.value)}
            selectionMode="multiple"
            metaKeySelection={false}
            selectionKeys={selectedKey}
            onSelectionChange={e => setSelectedKey(e.value)}
            nodeTemplate={template}
        />
        <Button label=' ' icon="pi pi-check" autoFocus disabled={!Object.keys(selectedKey).length} onClick={() => {
            onSelect(
                Object
                    .entries(selectedKey)
                    .filter(([, checked] : [string, boolean]) => checked)
                    .map(([name]) => name)
            );
            close();
        }}
        >Add</Button>
        <Button label=' ' icon="pi pi-times" onClick={close} className="p-button-text">Cancel</Button>
    </Dialog>;
}
