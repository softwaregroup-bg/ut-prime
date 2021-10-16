import React from 'react';
import clsx from 'clsx';

import { ListBox, PanelMenu, TabMenu } from '../prime';
import { Styled, StyledType } from './ThumbIndex.types';

const ThumbIndex: StyledType = ({ classes, className, items, orientation = 'left', children, onFilter, ...rest }) => {
    const [[selectedList, activeIndex], setList] = React.useState([items[0], 0]);
    const handleListChange = React.useCallback(({value, index}) => {
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
    const tabs = orientation === 'left' ? <ListBox
        value={selectedList}
        options={items}
        itemTemplate={({icon, label}) => <><i className={icon}> {label}</i></>}
        onChange={handleListChange}
        style={{border: 0}}
    /> : <TabMenu
        model={items}
        activeIndex={activeIndex}
        onTabChange={handleListChange}
    />;
    return (
        <div className={clsx('flex flex-row', {'lg:col-2': !!model?.length}, className)} {...rest}>
            {tabs}
            {!!model?.length && <PanelMenu
                style={{flexGrow: 1}}
                model={model}
            />}
            {children}
        </div>
    );
};

export default Styled(ThumbIndex);
