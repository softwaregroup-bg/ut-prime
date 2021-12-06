import Joi from 'joi';
import { Schema, Property } from '../types';

function validation(name, field) {
    let result = field.validation;
    if (!result) {
        switch (field.type) {
            case 'string':
                result = Joi.string().min(0).allow('', null);
                break;
            case 'number':
                result = Joi.number();
                break;
            case 'boolean':
                result = Joi.boolean();
                break;
            case 'array':
                result = Joi.array();
                break;
            default:
                result = Joi.any();
                break;
        }
    }
    return result.label(field.title || name);
}

export default function getValidation(schema: Schema | Property, filter?: string[], path: string = '') : Joi.Schema {
    return Object.entries(schema.properties || {}).reduce(
        (schema, [name, field]) => {
            if ('properties' in field) {
                return schema.append({[name]: getValidation(field, filter, path ? path + '.' + name : name)});
            } else if ('items' in field) {
                return schema.append({[name]: Joi.array().items(getValidation(field.items, filter, path ? path + '.' + name : name))});
            } else {
                if (!filter?.includes(path ? path + '.' + name : name)) return schema;
                return schema.append({[name]: validation(name, field)});
            }
        },
        Joi.object(path ? {} : {
            $key: Joi.any().strip(),
            $: Joi.any().strip()
        })
    );
};
