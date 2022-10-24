import React from 'react';
import { compareJSON, deepEqual, getLineInfo, isArray, repeat, isObject } from './helpers';
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

    function componentWillMount() {
        const { left, right, onDifference } = this.props;
        const diff = compareJSON(left, right);
        onDifference({
            added: (diff.left || []).filter((line) => { return line.added; }).length,
            deleted: (diff.right || []).filter((line) => { return line.deleted; }).length,
            changed: (diff.left || []).filter((line) => { return line.changed; }).length
        });
    }

    function componentWillReceiveProps(nextprops) {
        const { left, right, onDifference } = nextprops;
        if (!deepEqual(left, this.props.left) || !deepEqual(right, this.props.right)) {
            const diff = compareJSON(left, right);
            onDifference({
                added: (diff.left || []).filter((line) => { return line.added; }).length,
                deleted: (diff.right || []).filter((line) => { return line.deleted; }).length,
                changed: (diff.left || []).filter((line) => { return line.changed; }).length
            });
        }
    }

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
            if (obj.href) {
                return <span> <Text> {obj.value}</Text> <a target='_blank' rel='noreferrer noopener' className={classes.activeLink} href={obj.href}> Preview </a> </span>;
            } else return <Text> {obj.value}</Text>;
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
                return <span className={classes.objValue}> {getValueElement(tValue)} </span>;
            }
            const contents = isNaN(idx) ? (<div className={classes.contents}>
                {line.level > 1 && <span className={classes.spaces}>{repeat(' ', (line.level - 1) * 2)}</span>}
                <span className={isTitle ? classes.objTitle : classes.objKey}>
                    <Text>{key}</Text>
                    {!isTitle && ':'}
                    {isArr && <span className={classes.arrayLabel}> [array]</span>}
                </span>
                {!isTitle && !isArr && <span className={classes.objValue}> {getValueElement(tValue)} </span>}
            </div>) : (<div className={classes.contents}>
                {line.level > 2 && <span className={classes.spaces}>{repeat(' ', (line.level - 2) * 2)}</span>}
                <span className={classes.arrayLabel}>{`[${key}]`}</span>
                {/* view array elements where the elements are not an obj */}
                {value && !isArr && !isObj && <span className={classes.objValue}>{getValueElement(tValue)}</span>}
            </div>);
            return contents;
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
                            <div className={classes.value}>{!line.empty && renderValue(!line.blurred ? line : diff.right[index])}</div>
                            {
                                line.changed
                                    ? (<div className={clsx(classes.value, classes.changedValue)}>
                                        <div className={classes.contents}>
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
                                    {!lLine.blurred && <div className={classes.value}>{!lLine.empty && renderValue(lLine)}</div>}
                                </div>
                            </div>
                        </div>
                        <div className={classes.rightWrap}>
                            <div className={clsx(classes.newLine, getStyleClass(rLine))}>
                                <div className={classes.lineContainer}>
                                    <div className={classes.lineColumn}>{lnRight}</div>
                                </div>
                                <div className={classes.valueContainer}>
                                    {!rLine.blurred && <div className={classes.value}>{!rLine.empty && renderValue(rLine)}</div>}
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
