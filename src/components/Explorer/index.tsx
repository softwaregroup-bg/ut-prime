import React from 'react';
import { DataTable, Column, Button, Toolbar, Splitter, SplitterPanel } from '../prime';

import { Styled, StyledType } from './Explorer.types';
import useToggle from '../hooks/useToggle';
import clsx from 'clsx';
import { InputText } from 'primereact/inputtext';

const Explorer: StyledType = ({
    classes,
    className,
    keyField,
    fetch,
    fields,
    resultSet,
    children,
    details,
    actions,
    filter
}) => {
    const [tableFilter, setFilters] = React.useState({...filter});
    const [items, setItems] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [current, setCurrent] = React.useState(null);
    const isEnabled = enabled => {
        if (typeof enabled !== 'string') return !!enabled;
        switch (enabled) {
            case 'current': return !!current;
            case 'selected': return selected && selected.length > 0;
            default: return false;
        }
    };
    const buttons = React.useMemo(() => (actions || []).map(({title, action, enabled = true}, index) =>
        <Button
            key={index}
            label={title}
            onClick={() => action({
                id: current && current[keyField],
                current,
                selected
            })}
            disabled={!isEnabled(enabled)}
            className="p-mr-2"
        />
    ), [keyField, current, selected]);
    React.useEffect(() => {
        async function load() {
            if (!fetch) {
                setItems([]);
            } else {
                const items = await fetch({...tableFilter, ...filter});
                setItems(resultSet ? items[resultSet] : items);
            }
        }
        load();
    }, [fetch, tableFilter, filter]);
    const Details = () =>
        <div style={{ width: '200px' }}>{
            current && Object.entries(details).map(([name, value], index) =>
                <div className={classes.details} key={index}>
                    <div className={classes.detailsLabel}>{value}</div>
                    <div className={classes.detailsValue}>{current[name]}</div>
                </div>
            )
        }</div>;
    const [navigationOpened, navigationToggle] = useToggle(true);
    const [detailsOpened, detailsToggle] = useToggle(true);
    const InputTextField = (field, title) =>
        <InputText
            type="text"
            value={tableFilter[field]}
            onChange={event => {
                const value = event.target.value;
                setFilters(prev => ({...prev, [field]: value}));
            }}
            placeholder={`Filter by ${title}`}
        />;
    return (
        <div className={clsx('p-d-flex', 'p-flex-column', className)} style={{height: '100%'}} >
            <Toolbar
                left={
                    <>
                        {children && <Button icon="pi pi-bars" className="p-mr-2" onClick={navigationToggle}/>}
                        {buttons}
                    </>
                }
                right={
                    <>
                        <Button icon="pi pi-bars" className="p-mr-2" onClick={detailsToggle}/>
                    </>
                }
            />
            <Splitter style={{flexGrow: 1}}>
                {[
                    children && navigationOpened && <SplitterPanel key='nav' size={15}>{children}</SplitterPanel>,
                    <SplitterPanel key='items' size={75}>
                        <DataTable
                            autoLayout
                            rows={10}
                            paginator
                            dataKey={keyField}
                            value={items}
                            selection={selected}
                            onSelectionChange={e => setSelected(e.value)}
                            onRowSelect={e => setCurrent(e.data)}
                        >
                            <Column selectionMode="multiple" style={{width: '3em'}}/>
                            {fields.map(({field, title, filter, action}) => <Column
                                key={field}
                                field={field}
                                header={title}
                                body={action && (row => <Button
                                    label={row[field]}
                                    style={{padding: 0, minWidth: 'inherit'}}
                                    className='p-button-link'
                                    onClick={() => action({
                                        id: row && row[keyField],
                                        current: row,
                                        selected: [row]
                                    })}
                                />)}
                                filter={!!filter}
                                filterElement={InputTextField(field, title)}
                            />)}
                        </DataTable>
                    </SplitterPanel>,
                    detailsOpened && <SplitterPanel key='details' size={10}>{Details()}</SplitterPanel>
                ].filter(Boolean)}
            </Splitter>
        </div>
    );
};

export default Styled(Explorer);
