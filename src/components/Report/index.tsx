import React from 'react';
import lodashGet from 'lodash.get';

import { Styled, StyledType } from './Report.types';

import { Button } from '../prime';
import Form from '../Form';
import Explorer from '../Explorer';

const flexGrow = {flexGrow: 1};

const Report: StyledType = ({ properties, validation, params = [], columns = [], fetch, onDropdown, resultSet }) => {
    const trigger = React.useRef(null);
    const dropdownNames = params
        .flat()
        .filter(Boolean)
        .map(name => lodashGet(properties, name?.replace(/\./g, '.properties.'))?.editor?.dropdown)
        .filter(Boolean);
    const [dropdowns, setDropdown] = React.useState({});
    async function init() {
        setDropdown(await onDropdown(dropdownNames));
    }
    React.useEffect(() => {
        init();
    }, []);
    const [filter, setFilter] = React.useState({});
    return (
        <>
            <div className='p-d-flex p-ai-center'>
                <Form
                    style={flexGrow}
                    properties={properties}
                    validation={validation}
                    cards={{params: {properties: params, className: 'p-col-12', flex: 'p-col-12 p-md-4 p-xl-3'}}}
                    layout={['params']}
                    onSubmit={setFilter}
                    value={filter}
                    dropdowns={dropdowns}
                    trigger={trigger}
                />
                <Button className='p-col-1' icon='pi pi-search' onClick={() => trigger?.current?.()}/>
            </div>
            <Explorer
                fetch={fetch}
                properties={properties}
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
