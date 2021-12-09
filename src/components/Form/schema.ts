import Joi from 'joi';
import { Schema, Property } from '../types';

function validation(name, field, required) {
    let result = field.validation;
    if (!result) {
        switch (field?.widget?.type || field.type) {
            case 'mask':
            case 'text':
            case 'password':
            case 'string':
                result = Joi.string().min(0).allow('', null);
                break;
            case 'currency':
            case 'number':
                result = Joi.number();
                break;
            case 'integer':
                result = Joi.number().integer();
                break;
            case 'boolean':
                result = Joi.boolean();
                break;
            case 'selectTable':
                result = field?.widget?.selectionMode === 'single' ? Joi.any() : Joi.array();
                break;
            case 'multiSelect':
            case 'multiSelectPanel':
            case 'multiSelectTree':
            case 'table':
            case 'array':
                result = Joi.array();
                break;
            case 'date-time':
            case 'time':
            case 'date':
                result = Joi.date();
                break;
            case 'dropdown':
            case 'dropdownTree':
            case 'select':
            default:
                result = Joi.any();
                break;
        }
    }
    if (required?.includes(name)) result = result.required();
    return result.label(field.title || name);
}

export default function getValidation(schema: Schema | Property, filter?: string[], path: string = '') : Joi.Schema {
    return Object.entries(schema.properties || {}).reduce(
        (prev, [name, field]) => {
            if ('properties' in field) {
                return prev.append({[name]: getValidation(field, filter, path ? path + '.' + name : name)});
            } else if ('items' in field) {
                return prev.append({[name]: Joi.array().items(getValidation(field.items, filter, path ? path + '.' + name : name))});
            } else {
                if (!filter?.includes(path ? path + '.' + name : name)) return prev;
                return prev.append({[name]: validation(name, field, schema.required)});
            }
        },
        Joi.object(path ? {} : {
            $: Joi.any().strip(),
            $key: Joi.any().strip(),
            $original: Joi.any()
        })
    );
};
