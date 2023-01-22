import React from 'react';
import { useSelector } from 'react-redux';

import {State} from '../Store/Store.types';
import permissionCheck from '../lib/permission';

const noPermissions = [];
const selector = ({login}: State) => login;

export default function usePermissionCheck() {
    const permissions = useSelector(selector)?.result?.['permission.get'] || noPermissions;
    const check = React.useMemo(() => permissionCheck(permissions), [permissions]);
    return React.useCallback(permission => check({permission}), [check]);
}
