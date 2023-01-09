export default function skip(input: unknown, values = [undefined]) {
    if (!input || typeof input !== 'object' || !values.length) return input;

    if (Array.isArray(input)) {
        return input
            .map(value => skip(value, values));
    }
    const entries = Object.entries(input);
    return entries.length ? Object.fromEntries(entries
        .map(([name, value]) => !values.includes(value) && [name, skip(value, values)])
        .filter(Boolean)
    ) : input;
}
