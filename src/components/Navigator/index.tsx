import React from 'react';
import clsx from 'clsx';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import TreeList, {Column} from 'devextreme-react/tree-list';

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
    const tree = React.useMemo(() => new DataSource({
        store: new CustomStore({
            key: keyField,
            load: async() => (await fetch({}))[resultSet]
        })
    }), [fetch]);
    return (
        <TreeList
            height='100%'
            className={clsx(classes.component, className)}
            id="employees"
            dataSource={tree}
            focusedRowEnabled={true}
            defaultExpandedRowKeys={[null]}
            showRowLines={false}
            showBorders={false}
            columnAutoWidth={true}
            rootValue={null}
            keyExpr={keyField}
            parentIdExpr={parentField}
        >
            <Column dataField={field} caption={title} />
        </TreeList>
    );
};

export default Styled(Navigator);
