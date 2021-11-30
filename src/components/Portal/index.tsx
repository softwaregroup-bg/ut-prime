import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import Immutable from 'immutable';
import { useTheme } from '@material-ui/core/styles';

import { Theme } from '../Theme';
import { Menubar, TabView, TabPanel } from '../prime';
import Context from '../Context';
import Text from '../Text';
import {logout} from '../Login/actions';
import permissionCheck from '../lib/permission';
import {State} from '../Store/Store.types';

import { Styled, StyledType } from './Portal.types';
import { useWindowSize } from '../hooks';
const backgroundNone = {background: 'none'};

const filterMenu = (permissions, command, items) => items
    .filter(Boolean)
    .filter(permissions ? permissionCheck(permissions.toJS()) : Boolean)
    .map(({title, items, ...item}) => ({
        title,
        label: title,
        ...items ? {items: filterMenu(permissions, command, items)} : {command},
        ...item
    }))
    .filter(item => item?.items?.length || item.component || item.action);

const Portal: StyledType = ({ classes, children }) => {
    const {ut} = useTheme<Theme>();
    const {
        tabs = [],
        hideTabs,
        menu,
        menuClass = 'menuGrow',
        rightMenu,
        rightMenuClass = 'menu',
        rightMenuItems
    } = useSelector(({portal}: State) => portal || {
        tabs: undefined,
        menu: undefined,
        menuClass: undefined,
        hideTabs: undefined,
        rightMenu: undefined,
        rightMenuClass: undefined,
        rightMenuItems: undefined
    });
    const login = useSelector(({login}: State) => login);
    const initials = Immutable.getIn(login, ['profile', 'initials'], 'N/A');
    const permissions = Immutable.getIn(login, ['result', 'permission.get'], false);
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const size = useWindowSize();
    const {portalName} = React.useContext(Context);
    const command = React.useCallback(({item}) => {
        if (item.component || item.tab) {
            dispatch({type: 'front.tab.show', ...item});
        } else if (item.action) {
            dispatch(item.action());
        }
    }, [dispatch]);
    const found = tabs.findIndex(tab => tab.path === (location.pathname + location.search));
    const tabIndex = found >= 0 ? found : undefined;
    const handleTabSelect = React.useCallback(event => {
        if (event?.originalEvent?.target?.classList?.contains('pi-times')) {
            dispatch({
                type: 'front.tab.close',
                data: tabs[event.index]
            });
        } else {
            history.push(tabs[event.index].path);
        }
    }, [dispatch, history, tabs]);

    const menuEnabled = React.useMemo(() => filterMenu(permissions, command, menu || []), [command, menu, permissions]);
    const rightEnabled = React.useMemo(() => filterMenu(permissions, command, rightMenu || [{
        title: initials,
        icon: 'user',
        items: [
            ...(rightMenuItems || []),
            {
                beginGroup: true,
                title: 'Logout',
                action: logout
            }
        ]
    }]), [permissions, command, rightMenu, initials, rightMenuItems]);

    if (location.pathname !== '/' && !tabs.find(tab => tab.path === location.pathname + location.search)) {
        dispatch({
            type: 'portal.route.find',
            path: location.pathname + location.search
        });
    }
    return (
        <div className='flex flex-column' style={{height: size.height}}>
            <div className={classes.headerContainer}>
                <div className='flex align-items-center justify-content-center'>
                    <div className={clsx(classes.headerLogo, ut?.classes?.headerLogo)}></div>
                    <div className={classes.headerTitle}>
                        <Text>{portalName}</Text>
                    </div>
                    <Menubar model={menuEnabled} className={classes[menuClass]} style={backgroundNone}/>
                    <Menubar model={rightEnabled} className={classes[rightMenuClass]} style={backgroundNone}/>
                </div>
            </div>
            {(hideTabs)
                ? (({Component, params}) => <Component {...params}/>)(tabs[tabIndex || 0] || {Component() { return null; }, params: undefined})
                : <TabView activeIndex={tabIndex} onTabChange={handleTabSelect} className={classes.tabs}>
                    {tabs.map(({title, path, Component, params}) =>
                        <TabPanel key={path} header={<>{title}&nbsp;&nbsp;</>} rightIcon='pi pi-times'>
                            <Component {...params}/>
                        </TabPanel>
                    )}
                </TabView>
            }
            {children}
        </div>
    );
};

export default Styled(Portal);
