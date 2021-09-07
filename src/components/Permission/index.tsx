import React from 'react';

import { StyledType } from './Permission.types';
import usePermission from '../hooks/usePermission';

const Permission: StyledType = ({ permission, children }) => usePermission(permission) ? <>{children}</> : null;

export default Permission;
