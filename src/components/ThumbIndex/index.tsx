import React from 'react';
import clsx from 'clsx';

import { ListBox, PanelMenu, TabMenu, Ripple } from '../prime';
import ScrollBox from '../ScrollBox';
import { ComponentProps } from './ThumbIndex.types';
import testid from '../lib/testid';

const ThumbIndex: ComponentProps = ({ name, className, items, orientation = 'left', children, onFilter, ...rest }) => {
    const [[selectedList, activeIndex], setList] = React.useState([items[0], 0]);
    const handleListChange = React.useCallback(({value, index}) => {
        if (index === undefined) index = value.index;
        setList([value, index]);
        onFilter([value?.items?.[0] || value, index]);
    }, [onFilter]);
    const model = React.useMemo(() => {
        const command = index => ({item}) => onFilter && onFilter([item, index]);
        const result = (selectedList?.items || []).map((item, index) => ({
            ...item,
            command: command(index),
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

    return (
        <div className={clsx('flex flex-row pb-0', {'lg:col-2': !!model?.length}, className)} {...rest}>
            {tabs}
            {!!model?.length && <ScrollBox className='w-full overflow-y-auto' noScroll={rest.hidden}>
                <PanelMenu
                    className='flex-1'
                    model={model}
                />
            </ScrollBox>}
            {children}
        </div>
    );
};

export default ThumbIndex;
