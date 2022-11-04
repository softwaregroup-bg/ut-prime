import React from 'react';
import clsx from 'clsx';
import {createUseStyles} from 'react-jss';

import compare from './lib';
import { ComponentProps } from './Json.types';
import Text from '../Text';

const useStyles = createUseStyles({
    unchanged: {color: 'var(--primary-color)'},
    changed: {color: 'var(--primary-color)'},
    deleted: {color: 'var(--red-500)'},
    added: {color: 'var(--green-500)'},
    spaces: {
        whiteSpace: 'pre-wrap',
        display: 'inline-block'
    }
});

const arrow = <span className='ml-2'>→</span>;
const Json: ComponentProps = ({
    showUnchangedValues = true,
    value,
    previous = value,
    ...props
}) => {
    const classes = useStyles();
    const diff = compare(value, previous);

    const lineClass = line =>
        line.changed ? classes.changed
            : line.deleted ? classes.deleted
                : line.added ? classes.added
                    : classes.unchanged;

    function renderValue(line, className, noLabel = false) {
        const { isTitle } = line;
        const idx = parseInt(line.key || '');
        const key = (!isNaN(idx)) ? idx.toString() : line.label;
        const isArray = Array.isArray(line.value);
        const isObject = line.value != null && typeof line.value === 'object';
        const value = (!isArray && !isObject && line.value?.toString()) ?? '';
        const textValue = <span className={clsx('ml-2', className)}><Text>{value}</Text></span>;
        return noLabel ? textValue : isNaN(idx) ? <span>
            {line.level > 1 && <span className={classes.spaces}>{' '.repeat((line.level - 1) * 2)}</span>}
            <span className={clsx(isTitle && 'text-xl font-bold')}>
                <Text>{String(key)}</Text>
                {!isTitle && ':'}
            </span>
            {line.added && arrow}
            {!isTitle && !isArray && textValue}
        </span> : <span>
            {line.level > 1 && <span className={classes.spaces}>{' '.repeat((line.level - 1) * 2)}</span>}
            <span>{`[${key}]`}</span>
            {line.added && arrow}
            {value && !isArray && !isObject && textValue}
        </span>;
    }

    return <div className='w-full p-component' {...props}>{
        diff.left.map((current, index) => {
            const prev = diff.right[index];
            if (!showUnchangedValues && current.unchanged && prev.unchanged) return null;
            if (
                (current.value == null || (Array.isArray(current.value) && !current.value.length)) &&
                (prev.value == null || (Array.isArray(prev.value) && !prev.value.length))
            ) return null;
            const renderPrev = !prev.blurred && !prev.empty && (current.added || prev.deleted || current.changed);
            return <div key={index} className='pb-1'>
                {renderPrev && renderValue(prev, lineClass(prev))}
                {renderPrev && arrow}
                {!current.blurred && !current.empty && renderValue(current, lineClass(current), renderPrev)}
            </div>;
        })
    }</div>;
};

export default Json;
