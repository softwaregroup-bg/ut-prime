import lodashGet from 'lodash.get';

import getValidation from '../Form/schema';
import type Joi from 'joi';
import type {Schema, Editors, Cards} from '../types';

const columns = (propertyName, property) => []
    .concat(property?.hidden)
    .concat(property?.widgets)
    .filter(Boolean)
    .map(name => propertyName + '.' + name)
    .concat([].concat(property?.parent).filter(name => name && !name.startsWith('$.')))
    .concat(propertyName);

export default function fieldNames(
    cardNames: (string | string[])[],
    mergedCards: Cards,
    mergedSchema: Schema,
    editors: Editors
) : {
    fields: string[],
    validation: Joi.Schema,
    dropdownNames: string[]
} {
    const widgetName = widget =>
        typeof widget === 'string'
            ? columns(widget, lodashGet(mergedSchema?.properties, widget?.replace(/\./g, '.properties.'))?.widget)
            : columns(widget.name, widget);

    const fields = Array.from(
        new Set(
            // collect all widgets from cards
            cardNames
                .flat()
                .map(card => mergedCards?.[card]?.widgets)
                .flat()
                .filter(Boolean)
                // collect all column and field names
                .map(widgetName)
                .flat()
                // collect field names from custom editors
                .map(property => editors?.[property]?.properties || property)
                .flat()
                .filter(Boolean)
        )
    );

    return {
        fields,
        validation: getValidation(mergedSchema, fields)[0],
        dropdownNames: fields
            .map(name => {
                const property =
                    lodashGet(mergedSchema.properties, name?.replace(/\./g, '.properties.')) ||
                    lodashGet(mergedSchema.properties, name?.replace(/\./g, '.items.properties.'));
                return [
                    property?.widget?.dropdown,
                    property?.widget?.pivot?.dropdown
                ];
            })
            .flat()
            .filter(Boolean)
    };
}
