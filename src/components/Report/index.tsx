import React from 'react';
import lodashGet from 'lodash.get';

import { Styled, StyledType } from './Report.types';

import { Button } from '../prime';
import Form from '../Form';
import Explorer from '../Explorer';
import useLoad from '../hooks/useLoad';

const flexGrow = {flexGrow: 1};

const Report: StyledType = ({
    schema,
    validation,
    params = [],
    columns = [],
    fetch,
    onDropdown,
    resultSet
}) => {
    const [trigger, setTrigger] = React.useState();
    const dropdownNames = params
        .flat()
        .filter(Boolean)
        .map(name => lodashGet(schema?.properties, name?.replace(/\./g, '.properties.'))?.widget?.dropdown)
        .filter(Boolean);
    const [dropdowns, setDropdown] = React.useState({});

    useLoad(async() => {
        setDropdown(await onDropdown(dropdownNames));
    });
    const [filter, setFilter] = React.useState({});
    return (
        <>
            <div className='flex align-items-center'>
                <Form
                    style={flexGrow}
                    schema={schema}
                    validation={validation}
                    cards={{params: {widgets: params, className: 'col-12', flex: 'col-12 md:col-4 xl:col-3'}}}
                    layout={['params']}
                    onSubmit={setFilter}
                    value={filter}
                    dropdowns={dropdowns}
                    setTrigger={setTrigger}
                />
                <Button className='col-1' icon='pi pi-search' onClick={trigger} disabled={!trigger}/>
            </div>
            <Explorer
                fetch={fetch}
                schema={schema}
                columns={columns}
                resultSet={resultSet}
                details={false}
                filter={filter}
                showFilter={false}
                pageSize={10}
            />
        </>
    );
};

export default Styled(Report);
