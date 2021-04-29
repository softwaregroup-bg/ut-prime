import React from 'react';
import clsx from 'clsx';
import { Tree } from 'primereact/tree';

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
    resultSet
}) => {
    const [{items, expanded}, setItems] = React.useState({items: [], expanded: {}});
    const nodeTemplate = React.useCallback(node => <span>{node[field]}</span>, [field]);
    const [selectedNodeKey, setSelectedNodeKey] = React.useState(null);
    const setTree = result => {
        const children = result.reduce((prev, item) => ({
            ...prev,
            [item[parentField]]: (prev[item[parentField]] || []).concat(item)
        }), {});
        result.forEach(item => Object.assign(item, {
            key: item[keyField],
            children: children[item[keyField]]
        }));
        const items = result.filter(item => item[keyField] in children);
        setItems({
            items,
            expanded: items.reduce((prev, {key}) => ({...prev, [key]: true}), {})
        });
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
            onSelectionChange={e => setSelectedNodeKey(e.value)}
        /> : null
    );
};

export default Styled(Navigator);
