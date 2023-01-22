import React from 'react';
import { useSelector } from 'react-redux';

import {State} from '../Store/Store.types';
import permissionCheck from '../lib/permission';

const noPermissions = [];
const selector = ({login}: State) => login;

export default function usePermission(permission) {
    const login = useSelector(selector);
    const permissions = login?.result?.['permission.get'] || noPermissions;
    return React.useMemo(() => permissionCheck(permissions)({permission}), [permissions, permission]);
}
