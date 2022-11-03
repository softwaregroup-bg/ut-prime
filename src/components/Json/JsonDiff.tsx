import React from 'react';
import { compareJSON, getLineInfo, isArray, repeat, isObject } from './helpers';
import clsx from 'clsx';

import Text from '../Text';
import {useStyles} from './styles';
import { ComponentProps } from './JsonDiff.types';

const JsonDiff: ComponentProps = ({
    highlightAdditions = true,
    isInlineView = false,
    highlightDeletions = true,
    highlightChangedValues = true,
    showUnchangedValues = false,
    left,
    right
}) => {
    const classes = useStyles();

    function renderDiff() {
        const ident = 4; const separator = '$.$';
        const diff = compareJSON(left, right, {
            separator,
            ident
        });
        function getStyleClass(line) {
            if (line.blurred) {
                return classes.blurred;
            } else if (line.unchanged) {
                return classes.unchanged;
            } else if (line.changed) {
                return classes.changed;
            } else if (line.deleted) {
                return classes.deleted;
            } else if (line.added) {
                return classes.added;
            }
        }
        function getValueElement(obj) {
            return <Text>{String(obj)}</Text>;
        }
        function renderValue(line, skipKey = false) {
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
            // const tValue = transformValue ? transformValue(line.key, separator, line.object) : {value};
            if (skipKey) {
                return <span className={clsx(classes.primary, 'ml-2')}> {getValueElement(tValue)} </span>;
            }
            return isNaN(idx) ? (<div>
                {line.level > 1 && <span className={classes.spaces}>{repeat(' ', (line.level - 1) * 2)}</span>}
                <span className={clsx(isTitle && 'text-xl font-bold')}>
                    <Text>{String(key)}</Text>
                    {!isTitle && ':'}
                </span>
                {!isTitle && !isArr && <span className={clsx(classes.primary, 'ml-2')}> {getValueElement(tValue)} </span>}
            </div>) : (<div>
                {line.level > 2 && <span className={classes.spaces}>{repeat(' ', (line.level - 2) * 2)}</span>}
                <span className={classes.primary}>{`[${key}]`}</span>
                {/* view array elements where the elements are not an obj */}
                {value && !isArr && !isObj && <span className={clsx(classes.primary, 'ml-2')}>{getValueElement(tValue)}</span>}
            </div>);
        }
        function renderInline() {
            const contents = [];
            let ldx = 1; let rdx = 1;
            function getInLine(line, index) {
                if (!showUnchangedValues && line.unchanged) {
                    return null;
                } else {
                    const lln = line.blurred || line.empty ? ('') : (ldx++);
                    const rln = diff.right[index].blurred || diff.right[index].empty ? ('') : (rdx++);
                    return (<div key={index} className={clsx(classes.newLine, getStyleClass(!line.blurred ? line : diff.right[index]))}>
                        <div className={classes.lineContainer}>
                            <div className={classes.lineColumn}>{lln}</div>
                        </div>
                        <div className={classes.lineSplitter} />
                        <div className={classes.lineContainer}>
                            <div className={classes.lineColumn}>{rln}</div>
                        </div>
                        <div className={classes.valueContainer}>
                            <div className={clsx(classes.primary, 'ml-2')}>{!line.empty && renderValue(!line.blurred ? line : diff.right[index])}</div>
                            {
                                line.changed
                                    ? (<div className={clsx(classes.primary, 'ml-2', classes.changedValue)}>
                                        <div>
                                            {renderValue(diff.right[index], true)}
                                        </div>
                                    </div>) : null
                            }
                        </div>
                    </div>);
                }
            }
            for (let i = 0; i < diff.left.length; i++) {
                const line = diff.left[i];
                contents.push(getInLine(line, i));
            }
            return <div>
                <div className={classes.inlineWrap}>
                    <div>
                        {contents}
                    </div>
                </div>
            </div>;
        }
        function renderSplit() {
            const contents = []; let lidx = 0; let ridx = 0;
            for (let i = 0; i < diff.left.length; i++) {
                const lLine = diff.left[i];
                const rLine = diff.right[i];
                if (!showUnchangedValues && lLine.unchanged && rLine.unchanged) {
                    continue;
                }
                const lnLeft = lLine.blurred || lLine.empty ? ('') : (++lidx);
                const lnRight = rLine.blurred || rLine.empty ? ('') : (++ridx);
                contents.push(
                    <div key={i + 1} className={classes.newLineContainer}>
                        <div className={classes.leftWrap}>
                            <div className={clsx(classes.newLine, getStyleClass(lLine))}>
                                <div className={classes.lineContainer}>
                                    <div className={classes.lineColumn}>{lnLeft}</div>
                                </div>
                                <div className={classes.valueContainer}>
                                    {!lLine.blurred && <div className={clsx(classes.primary, 'ml-2')}>{!lLine.empty && renderValue(lLine)}</div>}
                                </div>
                            </div>
                        </div>
                        <div className={classes.rightWrap}>
                            <div className={clsx(classes.newLine, getStyleClass(rLine))}>
                                <div className={classes.lineContainer}>
                                    <div className={classes.lineColumn}>{lnRight}</div>
                                </div>
                                <div className={classes.valueContainer}>
                                    {!rLine.blurred && <div className={clsx(classes.primary, 'ml-2')}>{!rLine.empty && renderValue(rLine)}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            return <div>
                {contents}
            </div>;
        }
        if (isInlineView) {
            return renderInline();
        } else {
            return renderSplit();
        }
    }

    return <div>{renderDiff()} </div>;
};

export default JsonDiff;
