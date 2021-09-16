import Joi from 'joi';
import { Properties } from '../types';

export default function getSchema(properties: Properties, filter?: string[], path: string = '') : Joi.Schema {
    return Object.entries(properties).reduce(
        (schema, [name, field]) => {
            if ('properties' in field) {
                return schema.append({[name]: getSchema(field.properties, filter, path ? path + '.' + name : name)});
            } else {
                if (!filter?.includes(path ? path + '.' + name : name)) return schema;
                const {title, validation = Joi.string().min(0).allow('', null)} = field;
                return schema.append({[name]: validation.label(title || name)});
            }
        },
        Joi.object()
    );
};
