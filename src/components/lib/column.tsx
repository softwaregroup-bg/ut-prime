import React from 'react';
import { Checkbox, Dropdown } from '../prime';

export interface TableFilter {
    filters?: {
        [name: string]: {
            value: any;
            matchMode: any;
        }
    },
    sortField?: string,
    sortOrder?: -1 | 1,
    first: number,
    page: number
}

export default function columnProps({
    name,
    properties,
    dropdowns,
    tableFilter,
    filterBy,
    onChange
}: {
    name: string,
    properties: {},
    dropdowns: {},
    tableFilter?: TableFilter,
    filterBy?: (name: string, value: string) => (e: {}) => void,
    onChange?: (e: {}) => void
}) {
    const {type, dropdown, parent, ...props} = properties?.[name]?.editor || {name};
    const fieldName = props.name || name;
    let filterElement, body, editor;
    switch (type) {
        case 'boolean':
            filterElement = filterBy && <Checkbox
                checked={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'checked')}
                {...props}
            />;
            body = function body(rowData) {
                const value = rowData[fieldName];
                if (value == null) return null;
                return <i className={`pi ${value ? 'pi-check' : 'pi-times'}`}></i>;
            };
            editor = function editor(props) {
                return <Checkbox
                    checked={props.rowData[fieldName]}
                    onChange={e => {
                        const updatedValue = [...props.value];
                        updatedValue[props.rowIndex][props.field] = e.checked;
                        onChange(updatedValue);
                    }}
                />;
            };
            break;
        case 'dropdown':
            filterElement = filterBy && <Dropdown
                className='w-full'
                options={dropdowns?.[dropdown] || []}
                value={tableFilter?.filters?.[fieldName]?.value}
                onChange={filterBy(fieldName, 'value')}
                showClear
                {...props}
            />;
            editor = function editor(props) {
                return <Dropdown
                    className='w-full'
                    options={dropdowns?.[dropdown] || []}
                    value={props.rowData[fieldName]}
                    onChange={e => {
                        const updatedValue = [...props.value];
                        updatedValue[props.rowIndex][props.field] = e.value;
                        onChange(updatedValue);
                    }}
                    showClear
                />;
            };
            break;
        case 'date':
            body = function body(rowData) {
                const value = rowData[fieldName];
                if (value == null) return null;
                return new Date(value).toLocaleDateString();
            };
            break;
        case 'time':
            body = function body(rowData) {
                const value = rowData[fieldName];
                if (value == null) return null;
                return new Date(value).toLocaleTimeString();
            };
            break;
        case 'date-time':
            body = function body(rowData) {
                const value = rowData[fieldName];
                if (value == null) return null;
                return new Date(value).toLocaleString();
            };
            break;
    }
    return {...filterElement && {filterElement}, ...body && {body}, ...editor && {editor}};
}
