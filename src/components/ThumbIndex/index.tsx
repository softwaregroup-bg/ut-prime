import React from 'react';
import clsx from 'clsx';
import {createUseStyles} from 'react-jss';

import { ListBox, PanelMenu, TabMenu, Ripple, Steps } from '../prime';
import ScrollBox from '../ScrollBox';
import { ComponentProps } from './ThumbIndex.types';
import testid from '../lib/testid';

const useStyles = createUseStyles({
    steps: {
        justifyContent: 'center',
        '& .p-steps .p-steps-item.p-highlight .p-steps-number': {
            background: 'var(--surface-border)'
        }
    },
    thumbs: {},
    tabs: {}
});

const ThumbIndex: ComponentProps = ({ name, className, items, orientation = 'left', type = 'thumbs', children, onFilter, ...rest }) => {
    const classes = useStyles();
    const [[selectedList, activeIndex], setList] = React.useState([items[0], 0]);
    const handleListChange = React.useCallback(({item, value = item, index = value.index}) => {
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
        const template = (item, {iconClassName, onClick: handleClick, labelClassName, className, numberClassName}) => (
            <a
                href={item.url || '#'}
                className={className}
                target={item.target}
                onClick={handleClick}
                role="presentation"
            >
                {type === 'steps' && <span className={numberClassName}>{item.index + 1}</span>}
                {item.icon && <span className={iconClassName}></span>}
                {item.label && <span className={labelClassName} {...testid((name || '') + item.id + 'Tab')}>{item.label}</span>}
                <Ripple />
            </a>
        );
        return items.map((item, index) => (type === 'thumbs' && orientation === 'left') ? item : ({template, ...type === 'steps' && {className: 'p-2'}, ...item, index}));
    }, [items, name, type]);

    let tabs;
    switch (`${type}-${orientation}`) {
        case 'thumbs-left':
            tabs = <ListBox
                value={selectedList}
                options={itemsTemplate}
                itemTemplate={({icon, label}) => <><i className={icon}> {label}</i></>}
                onChange={handleListChange}
                className='border-none'
            />;
            break;
        case 'steps-top':
            tabs = <Steps
                model={itemsTemplate}
                activeIndex={activeIndex}
                onSelect={handleListChange}
                readOnly={false}
            />;
            break;
        default:
            tabs = <TabMenu
                model={itemsTemplate}
                activeIndex={activeIndex}
                onTabChange={handleListChange}
            />;
    }

    return (
        <div className={clsx('flex flex-row pb-0', {'lg:col-2': !!model?.length}, className, classes[type])} {...rest}>
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
