import React from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';

import { Styled, StyledType } from './Explorer.types';
import useToggle from '../hooks/useToggle';
import clsx from 'clsx';

const Explorer: StyledType = ({
    classes,
    className,
    keyField,
    fetch,
    fields,
    resultSet,
    children,
    details
}) => {
    const [items, setItems] = React.useState([]);
    React.useEffect(() => {
        async function load() {
            setItems(resultSet ? (await fetch({}))[resultSet] : await fetch({}));
        }
        load();
    }, []);
    const [selectedItems, setSelectedItems] = React.useState(null);
    const [current, setCurrent] = React.useState({});
    const Details = () =>
        <div style={{ width: '200px' }}>{
            Object.entries(details).map(([name, value], index) =>
                <div className={classes.details} key={index}>
                    <div className={classes.detailsLabel}>{value}</div>
                    <div className={classes.detailsValue}>{current[name]}</div>
                </div>
            )
        }</div>;

    const [navigationOpened, navigationToggle] = useToggle(true);
    const [detailsOpened, detailsToggle] = useToggle(true);

    return (
        <div className={clsx('p-d-flex', 'p-flex-column', className)} style={{height: '100%'}} >
            <Toolbar
                left={<><Button icon="pi pi-bars" className="p-mr-2" onClick={navigationToggle}/></>}
                right={<><Button icon="pi pi-bars" className="p-mr-2" onClick={detailsToggle}/></>}
            />
            <Splitter style={{flexGrow: 1}}>
                {[
                    navigationOpened && <SplitterPanel key='nav' size={15}>{children}</SplitterPanel>,
                    <SplitterPanel key='items' size={75}>
                        <DataTable
                            autoLayout
                            rows={10}
                            paginator
                            dataKey={keyField}
                            value={items}
                            selection={selectedItems}
                            onSelectionChange={e => setSelectedItems(e.value)}
                            onRowSelect={e => setCurrent(e.data)}
                        >
                            <Column selectionMode="multiple" style={{width: '3em'}}/>
                            {fields.map(({field, title}) => <Column key={field} field={field} header={title} />)}
                        </DataTable>
                    </SplitterPanel>,
                    detailsOpened && <SplitterPanel key='details' size={10}>{Details()}</SplitterPanel>
                ].filter(Boolean)}
            </Splitter>
        </div>
    );
};

export default Styled(Explorer);
