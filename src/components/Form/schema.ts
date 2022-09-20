import Joi from 'joi';
import { Schema, Property } from '../types';
import getType from '../lib/getType';

function validation(name, field) {
    let result = field.validation;
    if (!result) {
        switch (field?.widget?.type || field.format || getType(field.type) || 'unknown') {
            case 'mask':
            case 'text':
            case 'password':
            case 'string':
                result = Joi.string();
                break;
            case 'unknown':
                result = Joi.alternatives().try(Joi.string(), Joi.number());
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
                result = Joi.array();
                break;
            case 'table':
            case 'array':
                result = Joi.array().sparse();
                break;
            case 'date-time':
            case 'time':
            case 'date':
                result = Joi.date();
                break;
            case 'file':
                result = Joi.any().raw();
                break;
            case 'dropdown':
            case 'dropdownTree':
            case 'select':
            default:
                result = Joi.any();
                break;
        }
    }
    return result.label(field.title || name);
}

export default function getValidation(schema: Schema | Property, filter?: string[], path = '', propertyName = '') : Joi.Schema {
    if (schema?.type === 'object' || schema?.properties) {
        return Object.entries(schema?.properties || {}).reduce(
            (prev, [name, field]) => {
                const next = getValidation(field, filter, path ? path + '.' + name : name, name);
                if (!next) return prev;
                return prev.append({[name]: schema?.required?.includes(name) ? next.empty([null, '']).required() : next.allow(null)});
            },
            Joi.object(path ? {} : {
                $: Joi.any().strip(),
                $key: Joi.any().strip(),
                ...filter?.includes('$original') && {$original: Joi.any()}
            })
        );
    }
    if (filter && !filter?.includes(path)) return null;
    if (schema?.type === 'array' || schema?.items) {
        return schema?.items ? Joi.array().sparse().items(getValidation(schema.items as Schema, filter, path, propertyName)) : Joi.array();
    } else if (schema?.oneOf) {
        return Joi.alternatives().try(...schema.oneOf.map(item => getValidation(item as Schema, filter, path, propertyName)).filter(Boolean)).match('one');
    } else if (schema?.anyOf) {
        return Joi.alternatives().try(...schema.anyOf.map(item => getValidation(item as Schema, filter, path, propertyName)).filter(Boolean)).match('any');
    } else if (schema?.allOf) {
        return Joi.alternatives().try(...schema.allOf.map(item => getValidation(item as Schema, filter, path, propertyName)).filter(Boolean)).match('all');
    } else {
        return validation(propertyName, schema);
    }
}
