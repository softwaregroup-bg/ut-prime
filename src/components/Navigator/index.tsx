import React from 'react';
import clsx from 'clsx';
import { Tree } from '../prime';

import { ComponentProps } from './Navigator.types';
import testid from '../lib/testid';

const Navigator: ComponentProps = ({
    className,
    fetch,
    field,
    title,
    keyField,
    parentField = 'parent',
    resultSet,
    onSelect
}) => {
    const [{items, expanded}, setItems] = React.useState({items: [], expanded: {}});
    const nodeTemplate = React.useCallback(node => <span {...testid(`navigator.${resultSet}Item/${node[keyField]}`)}>{node[field]}</span>, [field, keyField, resultSet]);
    const [selectedNodeKey, setSelectedNodeKey] = React.useState(null);
    const select = React.useCallback(e => {
        if (onSelect) onSelect(e.value);
        setSelectedNodeKey(e.value);
    }, [onSelect]);
    React.useEffect(() => {
        const setTree = result => {
            const children = result.reduce((prev, item) => parentField in item ? ({
                ...prev,
                [item[parentField]]: (prev[item[parentField]] || []).concat(item)
            }) : prev, {});
            result.forEach(item => Object.assign(item, {
                key: item[keyField],
                children: children[item[keyField]]
            }));
            const items = result.filter(item => item[parentField] == null);
            setItems({
                items,
                expanded: items.reduce((prev, {key}) => ({...prev, [key]: true}), {})
            });
            if (items.length) select({value: items[0][keyField]});
        };
        async function load() {
            setTree(resultSet ? (await fetch({}))[resultSet] : await fetch({}));
        }
        load();
    }, [fetch, keyField, parentField, resultSet, select]);
    return (
        items.length ? <Tree
            className={clsx('border-none', 'p-0', className)}
            value={items}
            nodeTemplate={nodeTemplate}
            selectionMode='single'
            selectionKeys={selectedNodeKey}
            expandedKeys={expanded}
            onSelectionChange={select}
        /> : null
    );
};

export default Navigator;
