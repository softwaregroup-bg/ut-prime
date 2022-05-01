import React from 'react';

import { ComponentProps } from './Permission.types';
import usePermission from '../hooks/usePermission';

const Permission: ComponentProps = ({ permission, children }) => usePermission(permission) ? <>{children}</> : null;

export default Permission;
