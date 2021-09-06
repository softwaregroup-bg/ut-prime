import Joi from 'joi';
import { Properties } from '../types';

export default function getSchema(properties: Properties, path: string = '', filter?: string[]) : Joi.Schema {
    return Object.entries(properties).reduce(
        (schema, [name, field]) => {
            if (!filter?.includes(path + '.' + name)) return schema;
            if ('properties' in field) {
                return schema.append({[name]: getSchema(field.properties, path + '.' + name, filter)});
            } else {
                const {title, validation = Joi.string().min(0).allow('', null)} = field;
                return schema.append({[name]: validation.label(title || name)});
            }
        },
        Joi.object()
    );
};
