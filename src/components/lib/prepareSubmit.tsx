import get from 'lodash.get';
import set from 'lodash.set';
import template from 'ut-function.template';

const query = (value: unknown, path: string | string[], name?: string | number, nested?: boolean) => {
    if (value == null) return (nested && value !== undefined) ? {name, value} : value;
    if (path === '') path = [];
    if (typeof path === 'string') path = path.split('.');
    if (!path.length) return (nested && value !== undefined) ? {name, value} : value;
    if (Array.isArray(value)) return value.map((item, index) => query(item, path, name ? name + '.' + index : index, true)).flat().filter(Boolean);
    return [query(value[path[0]], path.slice(1), name ? name + '.' + path[0] : path[0], true)].flat().filter(Boolean);
};

export default ([form, {tables = [], files = []} = {}, {method, params} = {method: '', params: ''}]) => {
    if (method) return params && JSON.parse(template(typeof params === 'string' ? params : JSON.stringify(params), form, {}, 'stringify'));
    const {$, ...value} = form;
    tables?.forEach(name => {
        const table = get(value, name);
        if (Array.isArray(table)) set(value, name, table.filter(Boolean));
    });
    if (files?.length) {
        const formData = new FormData();
        const parts = [];
        const skip = [];
        files.forEach(name => query(value, name)?.forEach(({name, value: file}) => {
            if (file.constructor !== File) return;
            parts.push([name, file[0]]);
            skip.push(file);
        }));
        formData.append('$', JSON.stringify(value, (key, value) => skip.includes(value) ? undefined : value));
        parts.forEach(([name, file]) => file && formData.append('$.' + name, file));
        return {formData};
    } else {
        return value;
    }
};
