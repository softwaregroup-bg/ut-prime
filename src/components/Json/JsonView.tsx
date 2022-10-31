import React from 'react';
import { compareJSON, getLineInfo } from './helpers';
import clsx from 'clsx';

import Text from '../Text';
import {useStyles} from './styles';

import { ComponentProps } from './JsonView.types';

const JsonView: ComponentProps = ({ value }) => {
    const classes = useStyles();
    const separator = '$.$';
    const diff = compareJSON(value, value, {separator, ident: 4});

    function getValueElement(obj) {
        return <Text>{String(obj)}</Text>;
    }
    function renderValue(line) {
        const { isTitle } = getLineInfo(line);
        const idx = parseInt((line.key || '').split(separator).pop());
        const key = (!isNaN(idx)) ? idx.toString() : line.label;
        const isArray = Array.isArray(line.value);
        const isObject = line.value != null && typeof line.value === 'object';
        const value = (!isArray && !isObject && line.value?.toString()) ?? '';
        return isNaN(idx) ? (<div>
            {line.level > 1 && <span className={classes.spaces}>{' '.repeat((line.level - 1) * 2)}</span>}
            <span className={clsx(isTitle && 'text-xl font-bold')}>
                <Text>{String(key)}</Text>
                {!isTitle && ':'}
            </span>
            {!isTitle && <span className={clsx(classes.primary, 'ml-2')}>{getValueElement(value)}</span>}
        </div>) : (<div>
            {line.level > 2 && <span className={classes.spaces}>{' '.repeat((line.level - 2) * 2)}</span>}
            <span className={classes.primary}>{`[${key}]`}</span>
            {value && !isArray && !isObject && <span className={clsx(classes.primary, 'ml-2')}>{getValueElement(value)}</span>}
        </div>);
    }
    return <div className='w-full'>
        <div>
            {diff.left.map((line, index) => (line.value == null || (Array.isArray(line.value) && !line.value.length)) ? null : <div key={index} className='flex pb-1'>
                <div className='px-3'>{!line.empty && renderValue(line)}</div>
            </div>)}
        </div>
    </div>;
};

export default JsonView;
