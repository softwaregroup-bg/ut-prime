import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import Immutable from 'immutable';

import { Menubar } from 'primereact/menubar';
import { TabView, TabPanel } from 'primereact/tabview';

import Context from '../Context';
import Text from '../Text';
import {logout} from '../Login/actions';
import permissionCheck from '../lib/permission';

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

const Portal: StyledType = ({ classes, children }) => {
    const {
        tabs = [],
        menu,
        rightMenu,
        rightMenuItems
    } = useSelector(({portal}) => portal || {});
    const login = useSelector(({login}) => login);
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
    const found = tabs.findIndex(tab => tab.path === location.pathname);
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
    }, [tabs]);

    const filterMenu = items => items
        .filter(permissions ? permissionCheck(permissions.toJS()) : Boolean)
        .map(({title, items, ...item}) => ({
            title,
            label: title,
            ...items ? {items: filterMenu(items)} : {command},
            ...item
        }));
    const menuEnabled = React.useMemo(() => filterMenu(menu || []), [menu, permissions]);
    const rightEnabled = React.useMemo(() => filterMenu(rightMenu || [{
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
    }]), [rightMenu, rightMenuItems, permissions]);

    if (location.pathname !== '/' && !tabs.find(tab => tab.path === location.pathname)) {
        dispatch({
            type: 'portal.route.find',
            path: location.pathname
        });
    }
    return (
        <div className='p-d-flex p-flex-column' style={{height: size.height}}>
            <div className={classes.headerContainer}>
                <div className='p-d-flex p-ai-center'>
                    <div className={classes.headerLogo}></div>
                    <div className={classes.headerTitle}>
                        <Text>{portalName}</Text>
                    </div>
                    <Menubar model={menuEnabled} style={{border: 0, flexGrow: 1}}/>
                    <Menubar model={rightEnabled} style={{border: 0}}/>
                </div>
            </div>
            <TabView activeIndex={tabIndex} onTabChange={handleTabSelect} className={classes.tabs}>
                {tabs.map(({title, path, Component, params}) =>
                    <TabPanel key={path} header={<>{title}&nbsp;&nbsp;</>} rightIcon='pi pi-times'>
                        <Component {...params}/>
                    </TabPanel>
                )}
            </TabView>
            {children}
        </div>
    );
};

export default Styled(Portal);
