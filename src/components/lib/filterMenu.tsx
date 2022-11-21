import React from 'react';

import { Ripple } from '../prime';
import Text from '../Text';
import testid from './testid';
import permissionCheck from './permission';

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
        {item.label && <span className={labelClassName} {...testid(`portal.menu.label${item.path || item.id}`)}><Text>{item.label}</Text></span>}
        {item.items && <span className={submenuIconClassName}></span>}
        <Ripple />
    </a>
);

const filterMenu = (permissions, command, items) => items
    ?.filter(Boolean)
    .filter(permissions ? permissionCheck(permissions) : Boolean)
    .map(({title, items, ...item}) => ({
        ...(item.path || item.id) && {template},
        title,
        label: title,
        ...items ? {items: filterMenu(permissions, command, items)} : {command},
        ...item
    }))
    .filter(item => item?.items?.length || item.component || item.action);

export default filterMenu;
