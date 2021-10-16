import Joi from 'joi';
import { Schema, Property } from '../types';

export default function getValidation(schema: Schema | Property, filter?: string[], path: string = '') : Joi.Schema {
    return Object.entries(schema.properties || {}).reduce(
        (schema, [name, field]) => {
            if ('properties' in field) {
                return schema.append({[name]: getValidation(field, filter, path ? path + '.' + name : name)});
            } else {
                if (!filter?.includes(path ? path + '.' + name : name)) return schema;
                const {title, validation = Joi.string().min(0).allow('', null)} = field;
                return schema.append({[name]: validation.label(title || name)});
            }
        },
        Joi.object()
    );
};
