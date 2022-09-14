import React from 'react';
import { useSelector } from 'react-redux';

import {State} from '../Store/Store.types';
import permissionCheck from '../lib/permission';

const noPermissions = [];

export default function usePermission(permission) {
    const login = useSelector(({login}: State) => login);
    const permissions = login?.result?.['permission.get'] || noPermissions;
    const check = React.useMemo(() => permissionCheck(permissions), [permissions]);
    return check({permission});
}
