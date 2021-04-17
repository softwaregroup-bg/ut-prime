export default permissions => {
    const cache = {};

    if (permissions.find(({actionId}) => actionId === '%')) return () => true;

    const regexp = new RegExp(
        permissions
            .map(permission => `^${permission.actionId.replace('.', '\\.').replace('%', '(.+?)')}$`)
            .join('|')
    );

    return ({permission}: {permission: string | string[]}) => {
        if (!permission) return true;
        if (!Array.isArray(permission)) permission = [permission];

        return permission.every(action => {
            let result = cache[action];
            if (result === undefined) {
                result = cache[action] = regexp ? regexp.test(action) : true;
            }
            return result;
        });
    };
};
