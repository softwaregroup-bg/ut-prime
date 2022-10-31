export function isObject(obj) {
    return obj !== null && typeof obj === 'object' &&
        Object.prototype.toString.call(obj) === '[object Object]';
}
export function isArray(obj) {
    return obj !== null && obj instanceof Array &&
        Object.prototype.toString.call(obj) === '[object Array]';
}
export function isBoolean(obj) {
    return obj !== null && typeof obj === 'boolean' &&
        Object.prototype.toString.call(obj) === '[object Boolean]';
}
export function isNumeric(obj) {
    return obj !== null && typeof obj === 'number' &&
        Object.prototype.toString.call(obj) === '[object Number]';
}
export function isString(obj) {
    return obj !== null && typeof obj === 'string' &&
        Object.prototype.toString.call(obj) === '[object String]';
}
export function isNull(obj) {
    return obj === null;
}
export function isEmpty(obj) {
    if (!isArray(obj) && !isObject(obj)) {
        return obj === null || obj === '' || obj === undefined;
    } else {
        return Object.keys(obj).length === 0;
    }
}
export function repeat(input, multiplier) {
    let str = '';
    const value = input;
    for (let i = 0, len = multiplier; i < len; i++) {
        str += value;
    }
    return str;
}
export const OBJECT_END = 'OBJECT_END';
export const OBJECT_START = 'OBJECT_START';
export const ARRAY_START = 'ARRAY_START';

export function getLineInfo(line) {
    return {
        isTitle: (line.key || '').indexOf('_START') !== -1,
        isArray: (line.key || '').indexOf('ARRAY') !== -1
    };
}

export function compareJSON(obj1, obj2, options = {}) {
    const left = [];
    const right = [];
    const sep = options.separator || '$.$';
    const currentLevels = [''];
    function compare(o1, o2) {
        if (isArray(o1) && isArray(o2)) {
            const arrangedElements = arrangeElements(o1, o2);
            o2 = arrangedElements.pop();
            o1 = arrangedElements.pop();
        }
        const leftKeys = Object.keys(o1 || {});
        const rightKeys = Object.keys(o2 || {});
        const mergedKeys = leftKeys.concat(rightKeys);
        const uniqueKeys = mergedKeys.filter(function(item, pos) { return mergedKeys.indexOf(item) === pos; });
        for (const idx in uniqueKeys) {
            const key = uniqueKeys[idx];
            const value = o1[key];
            const rvalue = o2[key];
            let opt = {};

            const added = leftKeys.includes(key) && !rightKeys.includes(key);
            const deleted = !leftKeys.includes(key) && rightKeys.includes(key);
            const dp = deepEqual(value, rvalue);
            if ((isObject(value) && isObject(rvalue)) || (isArray(value) && isArray(rvalue))) {
                left.push(new Line({
                    key: [isObject(value) ? OBJECT_START : ARRAY_START, ...currentLevels, key].join(sep),
                    label: key,
                    value,
                    level: currentLevels.length,
                    unchanged: dp
                }));
                right.push(new Line({
                    key: [isObject(rvalue) ? OBJECT_START : ARRAY_START, ...currentLevels, key].join(sep),
                    label: key,
                    value,
                    level: currentLevels.length,
                    unchanged: dp
                }));
                currentLevels.push(key);
                compare(value, rvalue);
                currentLevels.pop();
                left.push(new Line({
                    key: [isObject(value) ? OBJECT_END : OBJECT_END, ...currentLevels, key].join(sep),
                    empty: true,
                    level: currentLevels.length,
                    unchanged: dp
                }));
                right.push(new Line({
                    key: [isObject(rvalue) ? OBJECT_END : OBJECT_END, ...currentLevels, key].join(sep),
                    level: currentLevels.length,
                    empty: true,
                    unchanged: dp
                }));
            } else if (!isObject(value) || !isArray(!value)) {
                if (added) { // added lines
                    opt = {
                        key: [...currentLevels, key].join(sep),
                        label: key,
                        value,
                        level: currentLevels.length
                    };
                    if (isObject(value) || isArray(value)) {
                        left.push(new Line({
                            key: [isObject(value) ? OBJECT_START : ARRAY_START, ...currentLevels, key].join(sep),
                            level: currentLevels.length,
                            label: key,
                            value
                        }));
                        right.push(new Line({
                            key: [isObject(rvalue) ? OBJECT_START : ARRAY_START, ...currentLevels, key].join(sep),
                            level: currentLevels.length,
                            blurred: true
                        }));
                        currentLevels.push(key);
                        compare(value, isArray(value) ? [] : {});
                        currentLevels.pop();
                        left.push(new Line({
                            key: [isObject(value) ? OBJECT_END : OBJECT_END, ...currentLevels, key].join(sep),
                            empty: true,
                            level: currentLevels.length,
                            unchanged: dp
                        }));
                        right.push(new Line({
                            key: [isObject(rvalue) ? OBJECT_END : OBJECT_END, ...currentLevels, key].join(sep),
                            level: currentLevels.length,
                            empty: true,
                            blurred: true,
                            unchanged: dp
                        }));
                    } else {
                        left.push(new Line({
                            ...opt,
                            added: true
                        }));
                        right.push(new Line({
                            ...opt,
                            added: false,
                            blurred: true
                        }));
                    }
                } else if (deleted) { // deleted lines
                    opt = {
                        key: [...currentLevels, key].join(sep),
                        label: key,
                        value: rvalue,
                        level: currentLevels.length
                    };
                    if (isObject(rvalue) || isArray(rvalue)) {
                        left.push(new Line({
                            key: [isObject(value) ? OBJECT_START : ARRAY_START, ...currentLevels, key].join(sep),
                            level: currentLevels.length,
                            blurred: true
                        }));
                        right.push(new Line({
                            key: [isObject(value) ? OBJECT_START : ARRAY_START, ...currentLevels, key].join(sep),
                            level: currentLevels.length,
                            label: key,
                            value: rvalue
                        }));
                        currentLevels.push(key);
                        compare(isArray(rvalue) ? [] : {}, rvalue);
                        currentLevels.pop();
                        left.push(new Line({
                            key: [isObject(value) ? OBJECT_END : OBJECT_END, ...currentLevels, key].join(sep),
                            empty: true,
                            level: currentLevels.length,
                            blurred: true,
                            unchanged: dp
                        }));
                        right.push(new Line({
                            key: [isObject(rvalue) ? OBJECT_END : OBJECT_END, ...currentLevels, key].join(sep),
                            level: currentLevels.length,
                            empty: true,
                            unchanged: dp
                        }));
                    } else {
                        left.push(new Line({
                            ...opt,
                            blurred: true
                        }));
                        right.push(new Line({
                            ...opt,
                            deleted: true
                        }));
                    }
                } else if (value !== rvalue) { // changed lines
                    opt = {
                        key: [...currentLevels, key].join(sep),
                        level: currentLevels.length
                    };
                    left.push(new Line({
                        ...opt,
                        label: key,
                        value,
                        changed: true
                    }));
                    right.push(new Line({
                        ...opt,
                        label: key,
                        value: rvalue,
                        changed: true
                    }));
                } else if (value === rvalue) { // unchanged lines
                    opt = {
                        key: [...currentLevels, key].join(sep),
                        label: key,
                        value,
                        unchanged: true,
                        level: currentLevels.length
                    };
                    left.push(new Line(opt));
                    right.push(new Line(opt));
                }
            }
        }
    }
    compare(obj1, obj2);
    function removeConsecutiveEmptyLines(la) {
        const lines = [];
        for (let i = 0; i < la.length - 1; i++) {
            if (la[i].empty && la[i + 1].empty) {
                continue;
            } else {
                lines.push(la[i]);
            }
        }
        lines.length > 0 && lines.push(la[la.length - 1]);
        return lines;
    }
    return {
        left: removeConsecutiveEmptyLines(left),
        right: removeConsecutiveEmptyLines(right)
    };
}
export function deepEqual(val1, val2) {
    if (val1 === val2) {
        return true;
    } else if ((isObject(val1) || isArray(val1)) &&
            val1 !== null && val2 !== null) {
        const val1Keys = Object.keys(val1 || {});
        const val2Keys = Object.keys(val2 || {});

        const arr1Length = val1Keys.length;
        if (arr1Length === val2Keys.length) {
            for (let i = 0; i < arr1Length; i++) {
                if (val1Keys[i] === val2Keys[i]) {
                    if (!deepEqual(val1[val1Keys[i]], val2[val2Keys[i]])) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }

        return true;
    } else {
        return false;
    }
}

function Line(options = {}) {
    this.changed = options.changed || false;
    this.unchanged = options.unchanged || false;
    this.deleted = options.deleted || false;
    this.added = options.added || false;
    this.key = options.key;
    this.level = options.level || 0;
    this.empty = options.empty || false;
    this.blurred = options.blurred || false;
    this.label = options.label || '';
    this.value = options.value || null;
}

function arrangeElements(left, right) {
    let matched = []; let unmatched = [];
    left.forEach(function(leftElement) {
        if (right.find(rightElement => deepEqual(leftElement, rightElement) === true)) {
            matched.push(leftElement);
        } else unmatched.push(leftElement);
    });
    left = matched.concat(unmatched); // arrange left array with matched elements first
    matched = []; unmatched = [];
    left.forEach(function(leftElement) {
        if (right.find((rightElement) => { return deepEqual(leftElement, rightElement) === true; })) {
            matched.push(leftElement);
        }
    });
    right.forEach(function(rightElement) {
        if (!left.find((leftElement) => { return deepEqual(leftElement, rightElement) === true; })) {
            unmatched.push(rightElement);
        }
    });
    right = matched.concat(unmatched);
    return [left, right];
}
