import React from 'react';
import clsx from 'clsx';

import { ListBox, PanelMenu } from '../prime';
import { Styled, StyledType } from './ThumbIndex.types';

const ThumbIndex: StyledType = ({ classes, className, index, children, onFilter, ...rest }) => {
    const [selectedList, setList] = React.useState(index[0]);
    const handleListChange = React.useCallback(({value}) => {
        setList({...value});
        onFilter(value?.items?.[0].filter || []);
    }, [setList]);
    const model = React.useMemo(() => {
        const command = ({item}) => onFilter && onFilter(item.filter);
        const result = (selectedList?.items || []).map((item, index) => ({
            ...item,
            command,
            expanded: !index,
            items: (item.items || []).map(leaf => ({...leaf, expanded: false}))
        }));
        return result;
    }, [onFilter, selectedList]);
    return (
        <div className={clsx('p-d-flex', 'p-flex-row', className)} {...rest}>
            <ListBox
                value={selectedList}
                options={index}
                itemTemplate={({icon}) => <i className={icon}></i>}
                onChange={handleListChange}
                style={{border: 0}}
            />
            {!!model?.length && <PanelMenu
                style={{flexGrow: 1}}
                model={model}
            />}
            {children}
        </div>
    );
};

export default Styled(ThumbIndex);
