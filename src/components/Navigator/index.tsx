import React from 'react';
import clsx from 'clsx';
import { Tree } from '../prime';

import {
    Styled,
    StyledType
} from './Navigator.types';

const Navigator: StyledType = ({
    classes,
    className,
    fetch,
    field,
    title,
    keyField,
    parentField = 'parents',
    resultSet,
    onSelect
}) => {
    const [{items, expanded}, setItems] = React.useState({items: [], expanded: {}});
    const nodeTemplate = React.useCallback(node => <span>{node[field]}</span>, [field]);
    const [selectedNodeKey, setSelectedNodeKey] = React.useState(null);
    const select = React.useCallback(e => {
        if (onSelect) onSelect(e.value);
        setSelectedNodeKey(e.value);
    }, [onSelect]);
    const setTree = result => {
        const children = result.reduce((prev, item) => parentField in item ? ({
            ...prev,
            [item[parentField]]: (prev[item[parentField]] || []).concat(item)
        }) : prev, {});
        result.forEach(item => Object.assign(item, {
            key: String(item[keyField]),
            children: children[item[keyField]]
        }));
        const items = result.filter(item => item[parentField] == null);
        setItems({
            items,
            expanded: items.reduce((prev, {key}) => ({...prev, [key]: true}), {})
        });
        if (items.length) select({value: items[0][keyField]});
    };
    React.useEffect(() => {
        async function load() {
            setTree(resultSet ? (await fetch({}))[resultSet] : await fetch({}));
        }
        load();
    }, [fetch]);
    return (
        items.length ? <Tree
            style={{border: 0, padding: 0}}
            className={clsx(classes.component, className)}
            value={items}
            nodeTemplate={nodeTemplate}
            selectionMode='single'
            selectionKeys={selectedNodeKey}
            expandedKeys={expanded}
            onSelectionChange={select}
        /> : null
    );
};

export default Styled(Navigator);
