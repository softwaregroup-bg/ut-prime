export default (type: string | string[]) => {
    if (Array.isArray(type)) {
        const mainType = type.filter(t => t !== 'null');
        if (mainType.length === 1) type = mainType[0];
    }
    return type;
};
