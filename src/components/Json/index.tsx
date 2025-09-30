import React from 'react';
import clsx from 'clsx';
import {createUseStyles} from 'react-jss';

import compare from './lib';
import { ComponentProps } from './Json.types';
import Text from '../Text';

const useStyles = createUseStyles({
    json: {
        '& tr td:first-child': {
            width: 1,
            whiteSpace: 'pre'
        },
        '& tr td': {
            whiteSpace: 'nowrap'
        }
    },
    unchanged: {color: 'var(--primary-color)'},
    changed: {color: 'var(--primary-color)'},
    deleted: {color: 'var(--red-500)'},
    added: {color: 'var(--green-500)'}
});

const convert = keyValue => {
    const left = keyValue?.map?.(([key, value]) => ({
        unchanged: true,
        level: 0,
        empty: value == null,
        label: key,
        value
    })) ?? [];
    return {
        left,
        right: left
    };
};

const flatten = (properties, root = '') => Object.entries(properties || {}).reduce(
    (map, [name, property]) => {
        return ('properties' in property) ? {
            ...map,
            [root + name]: property,
            ...flatten(property.properties, root + name + '.')
        } : ('items' in property) ? {
            ...map,
            [root + name]: property,
            ...flatten(property.items.properties, root + name + '.')
        } : {
            ...map,
            [root + name]: property
        };
    },
    {}
);

const filterBySchema = (obj, schema) => {
    if (!schema) {
        return obj;
    }
    const schemaMap = flatten(schema);
    const convertType = (value, {type = 'string'}) => {
        switch (Array.isArray(type) ? type.shift() : type) {
            case 'number':
                return parseInt(value);
            case 'string':
                return value?.toString();
            default:
                return value;
        }
    };
    const filter = (obj, objPath = '') => {
        return obj && Object.entries(obj).reduce(
            (map, [name, property]) => {
                const properties = schemaMap[objPath ? `${objPath}.${name}` : name];
                if (!properties) {
                    return map;
                }
                if (Array.isArray(property)) {
                    return {
                        ...map,
                        [properties.title || name]: property.map(p =>
                            filter(p, objPath ? `${objPath}.${name}` : name)
                        )
                    };
                } else if (typeof property === 'object' && property) {
                    return {
                        ...map,
                        [properties.title || name]: filter(
                            property,
                            objPath ? `${objPath}.${name}` : name
                        )
                    };
                }
                return {
                    ...map,
                    [properties.title || name]: convertType(property, properties)
                };
            }, {}
        );
    };
    return filter(obj);
};

const arrow = <span className='ml-2 pi pi-arrow-right' />;
const Json: ComponentProps = ({
    showUnchangedValues = true,
    value,
    previous = value,
    keyValue,
    className,
    schema,
    ...props
}) => {
    const classes = useStyles();
    value = filterBySchema(value, schema?.properties);
    previous = filterBySchema(previous, schema?.properties);
    const diff = keyValue ? convert(value) : compare(value, previous);

    const lineClass = line =>
        line.changed ? classes.changed
            : line.deleted ? classes.deleted
                : line.added ? classes.added
                    : classes.unchanged;

    function renderValue(line, className, noLabel = false, children = null) {
        const { isTitle } = line;
        const idx = parseInt(line.key || '');
        const key = (!isNaN(idx)) ? idx.toString() : line.label;
        const isArray = Array.isArray(line.value);
        const isObject = line.value != null && typeof line.value === 'object';
        const value = (!isArray && !isObject && line.value?.toString()) ?? '';
        const textValue = <span className={clsx('ml-2', className)}><Text>{value}</Text></span>;
        return noLabel ? textValue : isNaN(idx) ? <>
            <td>
                {line.level > 1 && <span>{' '.repeat((line.level - 1) * 2)}</span>}
                <span className={clsx(isTitle && 'text-xl font-bold')}>
                    <Text>{String(key)}</Text>
                </span>
            </td>
            <td>
                {line.added && arrow}
                {!isTitle && !isArray && textValue}
                {children}
            </td>
        </> : <>
            <td>
                {line.level > 1 && <span>{' '.repeat((line.level - 1) * 2)}</span>}
                <span>{`[${key}]`}</span>
            </td>
            <td>
                {line.added && arrow}
                {value && !isArray && !isObject && textValue}
                {children}
            </td>
        </>;
    }

    return <table className={clsx(classes.json, 'p-component', className)} {...props}><tbody>{
        diff.left.map((current, index) => {
            const prev = diff.right[index];
            if (!showUnchangedValues && current.unchanged && prev.unchanged) return null;
            if (
                (current.value == null || (Array.isArray(current.value) && !current.value.length)) &&
                (prev.value == null || (Array.isArray(prev.value) && !prev.value.length))
            ) return null;
            const renderPrev = !prev.blurred && !prev.empty && (current.added || prev.deleted || current.changed);
            const currentValue = !current.blurred && !current.empty && renderValue(current, lineClass(current), renderPrev);
            return <tr key={index} className='pb-1'>
                {renderPrev ? renderValue(prev, lineClass(prev), false, <>{arrow}{currentValue}</>) : currentValue}
            </tr>;
        })
    }</tbody></table>;
};

export default Json;
