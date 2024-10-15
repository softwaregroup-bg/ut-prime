const isObject = obj => obj !== null && typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]';
const isArray = obj => obj !== null && obj instanceof Array && Object.prototype.toString.call(obj) === '[object Array]';

export default function compare(current, previous) {
    const left = [];
    const right = [];
    const levels = [''];
    function compareInner(o1, o2) {
        const currentKeys = Object.keys(o1 || {});
        const previousKeys = Object.keys(o2 || {});
        const uniqueKeys = Array.from(new Set([...currentKeys, ...previousKeys]));
        for (const idx in uniqueKeys) {
            const key = uniqueKeys[idx];
            const currentValue = o1[key];
            const previousValue = o2[key];
            const added = currentKeys.includes(key) && !previousKeys.includes(key);
            const deleted = (o1[key] == null) && (o2[key] != null);
            const dp = deepEqual(currentValue, previousValue);
            if ((isObject(currentValue) && isObject(previousValue)) || (isArray(currentValue) && isArray(previousValue))) {
                left.push(new Line({
                    isTitle: true,
                    key,
                    label: key,
                    value: currentValue,
                    level: levels.length,
                    unchanged: dp
                }));
                right.push(new Line({
                    isTitle: true,
                    key,
                    label: key,
                    value: currentValue,
                    level: levels.length,
                    unchanged: dp
                }));
                levels.push(key);
                compareInner(currentValue, previousValue);
                levels.pop();
                left.push(new Line({
                    key,
                    empty: true,
                    level: levels.length,
                    unchanged: dp
                }));
                right.push(new Line({
                    key,
                    level: levels.length,
                    empty: true,
                    unchanged: dp
                }));
            } else if (!isObject(currentValue) || !isArray(!currentValue)) {
                if (added) { // added lines
                    const options = {
                        key,
                        label: key,
                        value: currentValue,
                        level: levels.length
                    };
                    if (isObject(currentValue) || isArray(currentValue)) {
                        left.push(new Line({
                            isTitle: true,
                            key,
                            level: levels.length,
                            label: key,
                            value: currentValue
                        }));
                        right.push(new Line({
                            isTitle: true,
                            key,
                            level: levels.length,
                            blurred: true
                        }));
                        levels.push(key);
                        compareInner(currentValue, isArray(currentValue) ? [] : {});
                        levels.pop();
                        left.push(new Line({
                            key,
                            empty: true,
                            level: levels.length,
                            unchanged: dp
                        }));
                        right.push(new Line({
                            key,
                            level: levels.length,
                            empty: true,
                            blurred: true,
                            unchanged: dp
                        }));
                    } else {
                        left.push(new Line({
                            ...options,
                            added: true
                        }));
                        right.push(new Line({
                            ...options,
                            added: false,
                            blurred: true
                        }));
                    }
                } else if (deleted) { // deleted lines
                    const options = {
                        key,
                        label: key,
                        value: previousValue,
                        level: levels.length
                    };
                    if (isObject(previousValue) || isArray(previousValue)) {
                        left.push(new Line({
                            isTitle: true,
                            key,
                            level: levels.length,
                            blurred: true
                        }));
                        right.push(new Line({
                            isTitle: true,
                            key,
                            level: levels.length,
                            label: key,
                            value: previousValue
                        }));
                        levels.push(key);
                        compareInner(isArray(previousValue) ? [] : {}, previousValue);
                        levels.pop();
                        left.push(new Line({
                            key,
                            empty: true,
                            level: levels.length,
                            blurred: true,
                            unchanged: dp
                        }));
                        right.push(new Line({
                            key,
                            level: levels.length,
                            empty: true,
                            unchanged: dp
                        }));
                    } else {
                        left.push(new Line({
                            ...options,
                            blurred: true
                        }));
                        right.push(new Line({
                            ...options,
                            deleted: true
                        }));
                    }
                } else if (currentValue !== previousValue) { // changed lines
                    const options = {
                        key,
                        level: levels.length
                    };
                    left.push(new Line({
                        ...options,
                        label: key,
                        value: currentValue,
                        changed: true
                    }));
                    right.push(new Line({
                        ...options,
                        label: key,
                        value: previousValue,
                        changed: true
                    }));
                } else if (currentValue === previousValue) { // unchanged lines
                    const options = {
                        key,
                        label: key,
                        value: currentValue,
                        unchanged: true,
                        level: levels.length
                    };
                    left.push(new Line(options));
                    right.push(new Line(options));
                }
            }
        }
    }
    compareInner(current, previous);
    function removeConsecutiveEmptyLines(la) {
        if (la.length === 1) return la;
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
function deepEqual(val1, val2) {
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
    this.value = options.value;
    this.isTitle = options.isTitle;
}
