import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useTheme } from 'react-jss';
import {ErrorBoundary} from 'react-error-boundary';

import type { Theme } from '../Theme';
import { Menubar, TabView, TabPanel } from '../prime';
import filterMenu from '../lib/filterMenu';
import Context from '../Context';
import Text from '../Text';
import {logout} from '../Login/actions';
import {State} from '../Store/Store.types';
import Component from '../Component';

import { useStyles, ComponentProps } from './Portal.types';
import testid from '../lib/testid';

const backgroundNone = {background: 'none'};

function ErrorFallback({error}) {
    return (
        <div role="alert">
            <p>There was an unexpected error:</p>
            <pre style={{color: 'red'}}>{error.message}</pre>
        </div>
    );
}

const Portal: ComponentProps = ({ children }) => {
    const classes = useStyles();
    const {ut, Switch} = useTheme<Theme>();
    const {
        tabs = [],
        hideTabs,
        menu,
        menuClass = 'menuGrow',
        rightMenu,
        rightMenuClass = 'rightMenu',
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
    const initials = login?.profile?.initials || 'N/A';
    const permissions = login?.result?.['permission.get'] || false;
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const {portalName, extraTitleComponent} = React.useContext(Context);
    const command = React.useCallback(({item}) => {
        if (item.component || item.tab) {
            dispatch({type: 'front.tab.show', ...item});
        } else if (item.action) {
            Promise.resolve({})
                .then(() => item.action({login}))
                .then(action => action && dispatch(action))
                .catch(error => dispatch({type: 'front.error.open', error}));
        }
    }, [dispatch, login]);
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
        id: '/profile',
        items: [
            ...(rightMenuItems || []),
            {
                beginGroup: true,
                id: '/logout',
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
        <div className='flex flex-column h-screen'>
            <div className={classes.headerContainer}>
                <div className='flex align-items-center justify-content-center'>
                    <div className={clsx('hidden p-component lg:block', classes.headerLogo, ut?.classes?.headerLogo)}></div>
                    <div className={clsx('hidden p-component text-lg lg:block', classes.headerTitle)}>
                        <Text>{portalName}</Text>
                    </div>
                    <Menubar model={menuEnabled} className={classes[menuClass]} style={backgroundNone}/>
                    {extraTitleComponent ? <Component page={extraTitleComponent} /> : null}
                    {Switch ? <Switch /> : null}
                    <Menubar model={rightEnabled} className={classes[rightMenuClass]} style={backgroundNone}/>
                </div>
            </div>
            {(hideTabs)
                ? (({Component}) => <Component />)(tabs[tabIndex || 0] || {Component() { return null; }})
                : <TabView activeIndex={tabIndex} onTabChange={handleTabSelect} className={classes.tabs} renderActiveOnly={false}>
                    {tabs.map(({title, path, Component}, index) =>
                        <TabPanel key={path} header={<span {...testid(`portal.tab${path}`)}><Text>{title}</Text>&nbsp;&nbsp;<i className='pi pi-times vertical-align-bottom' {...testid(`portal.tab.close${path}`)}></i></span>}>
                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                <Component hidden={index !== tabIndex}/>
                            </ErrorBoundary>
                        </TabPanel>
                    )}
                </TabView>
            }
            {children}
        </div>
    );
};

export default Portal;
