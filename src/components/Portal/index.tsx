import React from 'react';
import Box, {Item} from 'devextreme-react/box';
import { useSelector, useDispatch } from 'react-redux';
import TabPanel from 'devextreme-react/tab-panel';
import { useLocation, useHistory } from 'react-router-dom';
import Immutable from 'immutable';

import Menu from 'devextreme-react/menu';

import Context from '../Context';
import Text from '../Text';
import {logout} from '../Login/actions';
import permissionCheck from '../lib/permission';

import Title from './Title';
import { Styled, StyledType } from './Portal.types';

// https://usehooks.com/useWindowSize/
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = React.useState({
        width: undefined,
        height: undefined
    });

    React.useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

const ItemComponent = ({Component, params}) => <Component {...params} />;

const Portal: StyledType = ({ classes, children }) => {
    const {
        tabs = [],
        menu = [],
        rightMenu = [],
        rightMenuItems = []
    } = useSelector(({portal}) => portal || {});
    const login = useSelector(({login}) => login);
    const initials = Immutable.getIn(login, ['profile', 'initials'], 'N/A');
    const permissions = Immutable.getIn(login, ['result', 'permission.get'], false);
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const size = useWindowSize();
    const {portalName} = React.useContext(Context);
    const handleClick = React.useCallback(({itemData}) => {
        if (itemData.component || itemData.tab) {
            dispatch({type: 'front.tab.show', ...itemData});
        } else if (itemData.action) {
            dispatch(itemData.action());
        }
    }, [dispatch]);
    const found = tabs.findIndex(tab => tab.path === location.pathname);
    const tabIndex = found >= 0 ? found : undefined;
    const handleTabSelect = React.useCallback(({name, value}) => {
        if (name === 'selectedIndex') history.push(tabs[value].path);
    }, [tabs]);

    const menuEnabled = React.useMemo(() => {
        const filterMenu = items => items
            .filter(permissions ? permissionCheck(permissions.toJS()) : Boolean)
            .map(item => item.items ? {...item, items: filterMenu(item.items)} : item);
        return filterMenu(menu);
    }, [menu, permissions]);

    if (location.pathname !== '/' && !tabs.find(tab => tab.path === location.pathname)) {
        dispatch({
            type: 'portal.route.find',
            path: location.pathname
        });
    }
    return (
        <Box direction='col' width='100%' height={size.height}>
            <Item baseSize={59}>
                <div className={classes.headerContainer}>
                    <Box direction='row' height='100%' crossAlign='center'>
                        <Item baseSize={46}>
                            <div className={classes.headerLogo}></div>
                        </Item>
                        <Item baseSize='auto'>
                            <div className={classes.headerTitle}>
                                <Text>{portalName}</Text>
                            </div>
                        </Item>
                        <Item ratio={1}>
                            <Menu dataSource={menuEnabled}
                                displayExpr='title'
                                showFirstSubmenuMode='onClick'
                                orientation='horizontal'
                                submenuDirection='auto'
                                hideSubmenuOnMouseLeave={false}
                                onItemClick={handleClick}
                            />
                        </Item>
                        <Item baseSize='auto'>
                            <Menu
                                dataSource={
                                    rightMenu.length ? rightMenu : [{
                                        title: initials,
                                        icon: 'user',
                                        items: [
                                            ...rightMenuItems,
                                            {
                                                beginGroup: true,
                                                title: 'Logout',
                                                action: logout
                                            }
                                        ]
                                    }]
                                }
                                displayExpr='title'
                                showFirstSubmenuMode='onClick'
                                orientation='horizontal'
                                submenuDirection='auto'
                                hideSubmenuOnMouseLeave={false}
                                onItemClick={handleClick}
                            />
                        </Item>
                        <Item baseSize={10}></Item>
                    </Box>
                </div>
            </Item>
            <Item ratio={1}>
                <TabPanel
                    height='100%'
                    dataSource={tabs}
                    selectedIndex={tabIndex}
                    itemTitleComponent={Title}
                    repaintChangesOnly
                    itemRender={ItemComponent}
                    onOptionChanged={handleTabSelect}
                    noDataText=''
                />
                {children}
            </Item>
        </Box>
    );
};

export default Styled(Portal);
