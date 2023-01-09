import React from 'react';

import { ComponentProps } from './Report.types';

import Explorer from '../Explorer';
import type {DataTableProps} from '../prime';

const tableDefaults: DataTableProps = {paginatorPosition: 'top', size: 'small'};

const rename = prefix => param => typeof param === 'string' ? `${prefix}.${param}` : param.name ? {...param, name: `${prefix}.${param.name}`} : param;

const Report: ComponentProps = ({
    params = [],
    columns = [],
    init = {},
    validation,
    table,
    ...explorerProps
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
            params: params?.length ? ['params'] : []
        },
        view: ['params']
    }], [params, columns]);

    return (
        <>
            <Explorer
                pageSize={20}
                resultSet='result'
                {...explorerProps}
                cards={cards}
                layouts={layouts}
                layout='report'
                params={init}
                table={React.useMemo(() => ({...tableDefaults, ...table}), [table])}
                fetchValidation={validation}
            />
        </>
    );
};

export default Report;
