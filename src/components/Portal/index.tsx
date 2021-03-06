import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useTheme } from 'react-jss';
import {ErrorBoundary} from 'react-error-boundary';

import type { Theme } from '../Theme';
import { Menubar, TabView, TabPanel, Ripple } from '../prime';
import Context from '../Context';
import Text from '../Text';
import {logout} from '../Login/actions';
import permissionCheck from '../lib/permission';
import {State} from '../Store/Store.types';

import { useStyles, ComponentProps } from './Portal.types';
import { useWindowSize } from '../hooks';
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

const template = (item, {onClick, onKeyDown, className, iconClassName, labelClassName, submenuIconClassName}) => (
    <a
        href={item.url || '#'}
        role='menuitem'
        className={className}
        target={item.target}
        aria-haspopup={item.items != null}
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...testid(`portal.menu${item.path || item.id}`)}
    >
        {item.icon && <span className={iconClassName}></span>}
        {item.label && <span className={labelClassName} {...testid(`portal.menu.label${item.path || item.id}`)}>{item.label}</span>}
        {item.items && <span className={submenuIconClassName}></span>}
        <Ripple />
    </a>
);

const filterMenu = (permissions, command, items) => items
    .filter(Boolean)
    .filter(permissions ? permissionCheck(permissions) : Boolean)
    .map(({title, items, ...item}) => ({
        ...(item.path || item.id) && {template},
        title,
        label: title,
        ...items ? {items: filterMenu(permissions, command, items)} : {command},
        ...item
    }))
    .filter(item => item?.items?.length || item.component || item.action);

const Portal: ComponentProps = ({ children }) => {
    const classes = useStyles();
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
    const initials = login?.profile?.initials || 'N/A';
    const permissions = login?.result?.['permission.get'] || false;
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
    const style = React.useMemo(() => ({
        height: size.height
    }), [size.height]);

    if (location.pathname !== '/' && !tabs.find(tab => tab.path === location.pathname + location.search)) {
        dispatch({
            type: 'portal.route.find',
            path: location.pathname + location.search
        });
    }
    return (
        <div className='flex flex-column' style={style}>
            <div className={classes.headerContainer}>
                <div className='flex align-items-center justify-content-center'>
                    <div className={clsx('hidden p-component lg:block', classes.headerLogo, ut?.classes?.headerLogo)}></div>
                    <div className={clsx('hidden p-component text-lg lg:block', classes.headerTitle)}>
                        <Text>{portalName}</Text>
                    </div>
                    <Menubar model={menuEnabled} className={classes[menuClass]} style={backgroundNone}/>
                    <Menubar model={rightEnabled} className={classes[rightMenuClass]} style={backgroundNone}/>
                </div>
            </div>
            {(hideTabs)
                ? (({Component, params}) => <Component {...params}/>)(tabs[tabIndex || 0] || {Component() { return null; }, params: undefined})
                : <TabView activeIndex={tabIndex} onTabChange={handleTabSelect} className={classes.tabs} renderActiveOnly={false}>
                    {tabs.map(({title, path, Component, params}) =>
                        <TabPanel key={path} header={<span {...testid(`portal.tab${path}`)}>{title}&nbsp;&nbsp;<i className='pi pi-times vertical-align-bottom' {...testid(`portal.tab.close${path}`)}></i></span>}>
                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                <Component {...params}/>
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
