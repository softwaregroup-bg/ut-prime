import React from 'react';

import { ComponentProps } from './Report.types';

import Explorer from '../Explorer';
import type {DataTableProps} from '../prime';

const table: DataTableProps = {paginatorPosition: 'top'};

const rename = prefix => param => typeof param === 'string' ? `${prefix}.${param}` : param.name ? {...param, name: `${prefix}.${param.name}`} : param;

const Report: ComponentProps = ({
    name,
    schema,
    params = [],
    columns = [],
    design,
    init = {},
    hidden,
    fetch,
    methods,
    onDropdown,
    onCustomization,
    resultSet = 'result'
}) => {
    const [cards, layouts] = React.useMemo(() => [{
        params: {
            widgets: params.map(rename('params')),
            className: 'm-0 p-0',
            classes: {
                default: {
                    root: 'grid -m-2',
                    widget: 'field grid col-12 md:col-4 xl:col-3 mb-0'
                }
            }
        },
        columns: {
            widgets: columns.map(rename('result'))
        }
    }, {
        report: {
            columns: 'columns',
            params: ['params']
        }
    }], [params, columns]);

    return (
        <>
            <Explorer
                name={name}
                fetch={fetch}
                schema={schema}
                cards={cards}
                design={design}
                layouts={layouts}
                layout='report'
                resultSet={resultSet}
                params={init}
                hidden={hidden}
                pageSize={20}
                table={table}
                methods={methods}
                onDropdown={onDropdown}
                onCustomization={onCustomization}
            />
        </>
    );
};

export default Report;
