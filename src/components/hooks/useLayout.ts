import React from 'react';
import lodashGet from 'lodash.get';

import type { Properties, Editors, PropertyEditors, Cards, Schema, Layout } from '../types';
import getType from '../lib/getType';

const flatten = (properties: Properties, editors: Editors, root = '') : PropertyEditors => Object.entries(properties || {}).reduce(
    (map, [name, property]) => {
        return ('properties' in property) ? {
            ...map,
            ...flatten(property.properties, {}, root + name + '.')
        } : ('items' in property) ? {
            ...map,
            [root + name]: property,
            ...flatten(property.items.properties, {}, root + name + '.')
        } : {
            ...map,
            [root + name]: property
        };
    },
    {...editors}
);

const propertyType = property => property?.widget?.type || property?.format || getType(property?.type);

const getIndex = (properties: Properties, editors: Editors) : {
    properties: PropertyEditors,
    children: {[parent: string]: string[]},
    files: string[],
    tables: string[]
} => {
    const index = flatten(properties, editors);
    return {
        properties: index,
        children: Object.entries(index).reduce((prev, [name, property]) => {
            const parent = property?.widget?.parent;
            if (parent) {
                const items = prev[parent];
                if (items) items.push(name);
                else prev[parent] = [name];
            }
            return prev;
        }, {}),
        files: Object.entries(index).map(([name, property]) => propertyType(property) === 'file' && name).filter(Boolean),
        tables: Object.entries(index).map(([name, property]) => propertyType(property) === 'table' && name).filter(Boolean)
    };
};

export default (
    schema: Schema,
    cards: Cards,
    layout: Layout,
    editors: Editors,
    keyField: string = undefined
) => React.useMemo(() => {
    if (!layout) return;
    const visibleCards: Layout = (layout || Object.keys(cards));
    const widgetNames = widget => {
        widget = typeof widget === 'string' ? widget : widget.name;
        const editor = editors?.[widget.replace('$.edit.', '')];
        if (!editor) return widget;
        return widget.startsWith('$.edit.') ? editor.properties.map(name => '$.edit.' + name) : editor.properties;
    };
    const keyFieldAction = lodashGet(schema.properties, keyField?.replace(/\./g, '.properties.'))?.action;
    return {
        index: getIndex(schema.properties, editors),
        visibleCards,
        visibleProperties: Array.from(new Set(
            visibleCards.map(id => {
                const nested = [].concat(id);
                return nested.map(
                    cardName => {
                        const card = cards[typeof cardName === 'string' ? cardName : cardName.name];
                        return card && !card.hidden && card?.widgets?.map(widgetNames);
                    }
                );
            }).flat(10).filter(Boolean)
        )),
        open: keyFieldAction ? row => () => keyFieldAction({
            id: row && row[keyField],
            current: row,
            selected: [row]
        }) : undefined
    };
}, [schema, cards, layout, editors, keyField]);
