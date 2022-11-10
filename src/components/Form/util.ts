import get from 'lodash.get';
import isEmpty from 'lodash/isEmpty';

const decode = (pointerSegment: string) => pointerSegment?.replace(/~1/g, '/').replace(/~0/, '~');

const resolveSchema = (schema, schemaPath: string, rootSchema) => {
    const segments = schemaPath?.split('/').map(decode);
    return resolveSchemaWithSegments(schema, segments, rootSchema);
};

const invalidSegment = (pathSegment: string) => pathSegment === '#' || pathSegment === undefined || pathSegment === '';

const resolveSchemaWithSegments = (schema, pathSegments, rootSchema) => {
    if (isEmpty(schema)) {
        return undefined;
    }

    if (schema.$ref) {
        schema = resolveSchema(rootSchema, schema.$ref, rootSchema);
    }

    if (!pathSegments || pathSegments.length === 0) {
        return schema;
    }

    const [segment, ...remainingSegments] = pathSegments;

    if (invalidSegment(segment)) {
        return resolveSchemaWithSegments(schema, remainingSegments, rootSchema);
    }

    const singleSegmentResolveSchema = get(schema, segment);

    const resolvedSchema = resolveSchemaWithSegments(singleSegmentResolveSchema, remainingSegments, rootSchema);
    if (resolvedSchema) {
        return resolvedSchema;
    }

    if (segment === 'properties' || segment === 'items') {
        // Let's try to resolve the path, assuming oneOf/allOf/anyOf/then/else was omitted.
        // We only do this when traversing an object or array as we want to avoid
        // following a property which is named oneOf, allOf, anyOf, then or else.
        let alternativeResolveResult;

        const subSchemas = [].concat(
            schema.oneOf ?? [],
            schema.allOf ?? [],
            schema.anyOf ?? [],
            schema.then ?? [],
            schema.else ?? []
        );

        for (const subSchema of subSchemas) {
            alternativeResolveResult = resolveSchemaWithSegments(
                subSchema,
                [segment, ...remainingSegments],
                rootSchema
            );
            if (alternativeResolveResult) {
                break;
            }
        }
        return alternativeResolveResult;
    }

    return undefined;
};

export default function isRequired(schema, schemaPath, rootSchema): boolean {
    const pathSegments = schemaPath.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    // Skip "properties", "items" etc. to resolve the parent
    const nextHigherSchemaSegments = pathSegments.slice(0, pathSegments.length - 2);
    const nextHigherSchemaPath = nextHigherSchemaSegments.join('/');
    const nextHigherSchema = resolveSchema(schema, nextHigherSchemaPath, rootSchema);

    return (
        nextHigherSchema !== undefined &&
        ((nextHigherSchema?.items?.required && nextHigherSchema.items.required.indexOf(lastSegment) !== -1) ||
            (nextHigherSchema.required !== undefined && nextHigherSchema.required.indexOf(lastSegment) !== -1))
    );
}
