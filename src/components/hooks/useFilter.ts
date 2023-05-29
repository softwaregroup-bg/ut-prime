import React from 'react';
import lodashGet from 'lodash.get';
import {TableFilter} from '../lib/column';
import type {DataTableProps} from '../prime';
import type {WidgetReference} from '../types';

const useFilter: (
    initialFilters: TableFilter,
    columns: WidgetReference[],
    properties: object,
    showFilter: boolean
) => ([
    TableFilter,
    React.Dispatch<React.SetStateAction<TableFilter>>,
    (name: string, key: string) => (event: object) => void,
    Omit<TableFilter, 'page'> & {
        onSort: DataTableProps['onSort'],
        onFilter: DataTableProps['onFilter'],
        onPage: DataTableProps['onPage'],
        filterDisplay: DataTableProps['filterDisplay']
    },
]) = (
    initialFilters,
    columns,
    properties,
    showFilter
) => {
    const [tableFilter, setFilters] = React.useState<TableFilter>(initialFilters);
    const filterBy = React.useCallback((name: string, key: string) => e => {
        const value = lodashGet(e, key);
        setFilters(prev => {
            const next = {
                ...prev,
                first: 1,
                filters: {
                    ...prev?.filters,
                    [name]: {
                        ...prev?.filters?.[name],
                        value: value === '' ? undefined : value
                    }
                }
            };
            return next;
        });
    }, [setFilters]);
    const handleFilterPageSort = React.useCallback(event => setFilters(prev => ({...prev, ...event})), [setFilters]);

    const filterDisplay: DataTableProps['filterDisplay'] = React.useMemo(() => showFilter && columns?.some(column => {
        const isString = typeof column === 'string';
        const {name, ...widget} = isString ? {name: column} : column;
        const property = lodashGet(properties, name?.replace(/\./g, '.properties.'));
        return !!property?.filter || widget?.column?.filter;
    }), [columns, properties, showFilter]) ? 'row' : undefined;

    const filterProps = {
        first: tableFilter.first,
        sortField: tableFilter.sortField,
        sortOrder: tableFilter.sortOrder,
        filters: tableFilter.filters,
        onSort: handleFilterPageSort,
        onFilter: handleFilterPageSort,
        onPage: handleFilterPageSort,
        filterDisplay
    };

    return [tableFilter, setFilters, filterBy, filterProps];
};

export default useFilter;
