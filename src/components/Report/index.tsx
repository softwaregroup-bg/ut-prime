import React from 'react';
import lodashGet from 'lodash.get';

import { useStyles, ComponentProps } from './Report.types';

import { Button } from '../prime';
import Form from '../Form';
import getValidation from '../Form/schema';
import Explorer from '../Explorer';
import useLoad from '../hooks/useLoad';
import type {DataTableProps} from '../prime';

const flexGrow = {flexGrow: 1};
const paramsLayout = ['params'];
const table: DataTableProps = {paginatorPosition: 'top'};
const fieldName = widget => typeof widget === 'string' ? widget : widget.name;

const Report: ComponentProps = ({
    schema,
    params = [],
    columns = [],
    init = {},
    fetch,
    onDropdown,
    resultSet = 'result'
}) => {
    const classes = useStyles();
    const [trigger, setTrigger] = React.useState();
    const [dropdowns, setDropdown] = React.useState({});

    const [validation, dropdownNames] = React.useMemo(() => {
        const fieldNames = params.map(fieldName);
        const validation = getValidation(schema?.properties?.params, fieldNames);
        const dropdownNames = fieldNames
            .map(name => {
                const property = lodashGet(schema?.properties?.params?.properties, name?.replace(/\./g, '.properties.'));
                return [
                    property?.widget?.dropdown,
                    property?.widget?.pivot?.dropdown
                ];
            })
            .flat()
            .filter(Boolean);
        return [validation, dropdownNames];
    }, [schema, params]);

    const cards = React.useMemo(() => ({params: {widgets: params, className: 'col-12', flex: 'col-12 md:col-4 xl:col-3 mb-0'}}), [params]);

    useLoad(async() => {
        setDropdown(await onDropdown(dropdownNames));
    });
    const [filter, setFilter] = React.useState<[Record<string, unknown>] | [Record<string, unknown>, {files: []}]>([init]);
    const explorerFilter = React.useMemo(() => [
        {
            [resultSet]: filter[0]
        },
        {
            ...filter[1],
            files: filter?.[1]?.files?.map(name => `${resultSet}.${name}`)
        }
    ], [filter, resultSet]);
    return (
        <>
            <div className={`flex align-items-center ${classes.report}`}>
                <Form
                    style={flexGrow}
                    schema={schema?.properties?.params}
                    validation={validation}
                    cards={cards}
                    layout={paramsLayout}
                    onSubmit={setFilter}
                    value={filter[0]}
                    dropdowns={dropdowns}
                    setTrigger={setTrigger}
                    triggerNotDirty
                    autoSubmit
                />
                <Button className='col-1' icon='pi pi-search' onClick={trigger} disabled={!trigger}/>
            </div>
            <Explorer
                fetch={filter.length > 1 && fetch}
                schema={schema?.properties?.result}
                toolbar={false}
                columns={columns}
                resultSet={resultSet}
                filter={explorerFilter[0]}
                index={explorerFilter[1]}
                showFilter={false}
                pageSize={20}
                table={table}
            />
        </>
    );
};

export default Report;
