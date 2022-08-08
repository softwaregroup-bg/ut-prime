import React from 'react';
import clsx from 'clsx';
import {createUseStyles} from 'react-jss';

import { ListBox, PanelMenu, TabMenu, Ripple } from '../prime';
import { ComponentProps } from './ThumbIndex.types';
import testid from '../lib/testid';

import useWindowSize from '../hooks/useWindowSize';
import useBoundingClientRect from '../hooks/useBoundingClientRect';

const useStyles = createUseStyles({
    'padding-bottom-0': {
        paddingBottom: 0
    }
});

const ThumbIndex: ComponentProps = ({ name, className, items, orientation = 'left', children, onFilter, ...rest }) => {
    const classes = useStyles();
    const [[selectedList, activeIndex], setList] = React.useState([items[0], 0]);
    const handleListChange = React.useCallback(({value, index}) => {
        if (index === undefined) index = value.index;
        setList([value, index]);
        onFilter(value?.items?.[0] || value);
    }, [onFilter]);
    const model = React.useMemo(() => {
        const command = ({item}) => onFilter && onFilter(item);
        const result = (selectedList?.items || []).map((item, index) => ({
            ...item,
            command,
            expanded: !index,
            items: (item.items || []).map(leaf => ({...leaf, expanded: false}))
        }));
        return result;
    }, [onFilter, selectedList]);
    const itemsTemplate = React.useMemo(() => {
        const template = (item, {iconClassName, onClick: handleClick, labelClassName, className}) => (
            <a
                href={item.url || '#'}
                className={className}
                target={item.target}
                onClick={handleClick}
                role="presentation"
            >
                {item.icon && <span className={iconClassName}></span>}
                {item.label && <span className={labelClassName} {...testid((name || '') + item.id + 'Tab')}>{item.label}</span>}
                <Ripple />
            </a>
        );
        return items.map((item, index) => item.id ? ({template, ...item, index}) : item);
    }, [items, name]);

    const tabs = orientation === 'left' ? <ListBox
        value={selectedList}
        options={itemsTemplate}
        itemTemplate={({icon, label}) => <><i className={icon}> {label}</i></>}
        onChange={handleListChange}
        className='border-none'
    /> : <TabMenu
        model={itemsTemplate}
        activeIndex={activeIndex}
        onTabChange={handleListChange}
    />;

    const windowSize = useWindowSize();
    const {boundingClientRect: panelMenuRect, ref: panelMenuRef} = useBoundingClientRect();

    const panelMenuStyle = React.useMemo(() => {
        const maxHeight = windowSize.height - panelMenuRect?.top;
        return {
            maxHeight: (!isNaN(maxHeight) && maxHeight > 0) ? maxHeight : 0
        };
    }, [windowSize.height, panelMenuRect?.top]);

    return (
        <div className={clsx('flex flex-row', {'lg:col-2': !!model?.length}, className, classes['padding-bottom-0'])} {...rest}>
            {tabs}
            {!!model?.length && <div className='w-full' ref={panelMenuRef}>
                <PanelMenu
                    className={clsx('flex-1 overflow-y-auto')}
                    model={model}
                    style={panelMenuStyle}
                />    
            </div>}
            {children}
        </div>
    );
};

export default ThumbIndex;
