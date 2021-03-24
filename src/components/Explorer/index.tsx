import React from 'react';
import DataGrid, {Selection} from 'devextreme-react/data-grid';
import Box, { Item } from 'devextreme-react/box';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import Toolbar from 'devextreme-react/toolbar';
import Drawer from 'devextreme-react/drawer';

import { Styled, StyledType } from './Explorer.types';
import useToggle from '../hooks/useToggle';

const Explorer: StyledType = ({
    classes,
    className,
    keyField,
    fetch,
    fields,
    resultSet,
    children,
    details
}) => {
    const organizations = React.useMemo(() => new DataSource({
        store: new CustomStore({
            key: keyField,
            load: async() => (await fetch({}))[resultSet]
        })
    }), [fetch]);
    const [current, setCurrent] = React.useState({});
    const handleRowFocused = React.useCallback(({row}) => setCurrent(row.data), [setCurrent]);
    const Details = () =>
        <div style={{ width: '200px' }}>{
            Object.entries(details).map(([name, value], index) =>
                <div className={classes.details} key={index}>
                    <div className={classes.detailsLabel}>{value}</div>
                    <div className={classes.detailsValue}>{current[name]}</div>
                </div>
            )
        }</div>;

    const [navigationOpened, navigationToggle] = useToggle(true);
    const [detailsOpened, detailsToggle] = useToggle(true);
    const navigation = React.useCallback(
        () => <div style={{ width: '200px' }}>{children}</div>,
        [children]
    );

    return (
        <Box direction='col' height='100%' className={className}>
            <Item baseSize={76}>
                <Toolbar
                    items={[{
                        widget: 'dxButton',
                        location: 'before',
                        options: {
                            icon: 'menu',
                            onClick: navigationToggle
                        }
                    }, {
                        widget: 'dxButton',
                        location: 'after',
                        options: {
                            icon: 'menu',
                            onClick: detailsToggle
                        }
                    }]}
                />
            </Item>
            <Item ratio={1}>
                <Drawer
                    opened={navigationOpened}
                    openedStateMode='shrink'
                    position='left'
                    revealMode='slide'
                    component={navigation}
                >
                    <Drawer
                        opened={detailsOpened}
                        openedStateMode='shrink'
                        position='right'
                        revealMode='slide'
                        component={Details}
                    >
                        <DataGrid
                            height='100%'
                            focusedRowEnabled
                            onFocusedRowChanged={handleRowFocused}
                            dataSource={organizations}
                            defaultColumns={fields}
                            showBorders={true}
                        >
                            <Selection
                                mode='multiple'
                                selectAllMode='page'
                                showCheckBoxesMode='onClick'
                            />
                        </DataGrid>
                    </Drawer>
                </Drawer>
            </Item>
        </Box>
    );
};

export default Styled(Explorer);
