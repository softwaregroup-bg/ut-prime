import React from 'react';
import { useSelector } from 'react-redux';

import {State} from '../Store/Store.types';
import permissionCheck from '../lib/permission';

export default function usePermission(permission) {
    const login = useSelector(({login}: State) => login);
    const permissions = login?.result?.['permission.get'] || false;
    const check = React.useMemo(() => permissionCheck(permissions), [permissions]);
    return check({permission});
}
