import React from 'react';
import clsx from 'clsx';
import {createUseStyles} from 'react-jss';

import { ListBox, PanelMenu, TabMenu, Ripple, Steps, Button } from '../prime';
import ActionButton from '../ActionButton';
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

const ThumbIndex: ComponentProps = ({
    name,
    className,
    items,
    orientation = 'left',
    type = 'thumbs',
    children,
    trigger,
    loading,
    onFilter,
    validate,
    disableBack,
    methods,
    formApi,
    ...rest
}) => {
    const classes = useStyles();
    const [[selectedList, activeIndex], setList] = React.useState([items[0], 0]);
    const handleListChange = React.useCallback(async({item, value = item, index = value.index}) => {
        if (validate && validate(selectedList)?.error) return;
        if (value.onMount && !(await methods[value.onMount]({form: formApi}))) return;
        setList([value, index]);
        onFilter([value?.items?.[0] || value, index]);
    }, [onFilter, validate, selectedList, methods, formApi]);
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
    }, [items, name, type, orientation]);

    const next = React.useCallback(
        event => handleListChange({item: items[activeIndex + 1], index: activeIndex + 1}),
        [activeIndex, handleListChange, items]
    );
    const previous = React.useCallback(
        event => !disableBack && activeIndex && handleListChange({item: items[activeIndex - 1], index: activeIndex - 1}),
        [activeIndex, handleListChange, items, disableBack]
    );

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
            tabs = <>
                <Button
                    className='p-button-text m-1'
                    icon='pi pi-caret-left'
                    disabled={!activeIndex}
                    onClick={previous}
                />
                <Steps
                    model={itemsTemplate}
                    activeIndex={activeIndex}
                    onSelect={handleListChange}
                />
                <ActionButton
                    className='p-button-text m-1'
                    {...activeIndex >= items.length - 1 ? {
                        icon: 'pi pi-save',
                        disabled: !trigger || !!loading,
                        onClick: trigger
                    } : {
                        icon: 'pi pi-caret-right',
                        onClick: next
                    }}
                />
            </>;
            break;
        default:
            tabs = <TabMenu
                model={itemsTemplate}
                activeIndex={activeIndex}
                onTabChange={handleListChange}
            />;
    }

    return (
        <div
            className={clsx(
                'flex flex-row pb-0',
                {'lg:col-2': !!model?.length},
                orientation === 'top' && 'sticky top-0 z-1 surface-0',
                className, classes[type]
            )}
            {...rest}
        >
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
