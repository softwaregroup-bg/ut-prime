import React from 'react';
import { compareJSON, getLineInfo, isArray, repeat, isObject } from './helpers';
import clsx from 'clsx';

import Text from '../Text';
import {useStyles} from './styles';

import { ComponentProps } from './JsonView.types';

const JsonView: ComponentProps = ({ value }) => {
    const classes = useStyles();
    const ident = 4; const separator = '$.$';
    const diff = compareJSON(value, value, {
        separator,
        ident
    });
    function getStyleClass(line) {
        if (line.unchanged) {
            return classes.unchanged;
        }
    }
    function getValueElement(obj) {
        if (obj.href) {
            return <span> <Text> {String(obj.value)}</Text> <a target='_blank' rel='noreferrer noopener' className={classes.activeLink} href={obj.href}> Preview </a> </span>;
        } else return <Text> {String(obj.value)}</Text>;
    }
    function renderValue(line) {
        line.object = line.object || {};
        const { isTitle } = getLineInfo(line);
        let key;
        const idx = parseInt((line.key || '').split(separator).pop());
        if (!isNaN(idx)) key = idx.toString();
        else key = (Object.keys(line.object)[0] || '').toString();
        const isArr = isArray(line.object[key]);
        const isObj = isObject(line.object[key]);
        const value = !isArr && !isObj && line.object[key] !== null && line.object[key] !== undefined && line.object[key].toString();
        const tValue = {value};
        const contents = isNaN(idx) ? (<div className={classes.contents}>
            {line.level > 1 && <span className={classes.spaces}>{repeat(' ', (line.level - 1) * 2)}</span>}
            <span className={isTitle ? classes.objTitle : classes.objKey}>
                <Text>{String(key)}</Text>
                {!isTitle && ':'}
                {isArr && <span className={classes.arrayLabel}> [array]</span>}
            </span>
            {!isTitle && <span className={classes.objValue}>{getValueElement(tValue)}</span>}
        </div>) : (<div className={classes.contents}>
            {line.level > 2 && <span className={classes.spaces}>{repeat(' ', (line.level - 2) * 2)}</span>}
            <span className={classes.arrayLabel}>{`[${key}]`}</span>
            {/* view array elements where the elements are not an obj */}
            {value && !isArr && !isObj && <span className={classes.objValue}>{getValueElement(tValue)}</span>}
        </div>);
        return contents;
    }
    function renderJson() {
        const contents = [];
        let ldx = 1;
        function getLine(line, index) {
            const lln = line.blurred || line.empty ? ('') : (ldx++);
            return (<div key={index} className={clsx(classes.newLine, getStyleClass(!line.blurred ? line : diff.right[index]))}>
                <div className={classes.lineContainer}>
                    <div className={classes.lineColumn}>{lln}</div>
                </div>
                <div className={classes.valueContainer}>
                    <div className={classes.value}>{!line.empty && renderValue(line)}</div>
                </div>
            </div>);
        }
        for (let i = 0; i < diff.left.length; i++) {
            const line = diff.left[i];
            contents.push(getLine(line, i));
        }
        return (<div>
            <div className={classes.inlineWrap}>
                <div>
                    {contents}
                </div>
            </div>
        </div>
        );
    }
    return renderJson();
};

export default JsonView;
