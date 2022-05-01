import React from 'react';
import { Props as StoreProps } from '../Store/Store.types';
import type { Theme } from '../Theme';

export interface Props extends StoreProps, React.HTMLAttributes<HTMLDivElement> {
    theme: Theme,
    portalName: string,
    devTool?: boolean,
    loginPage?: string
}

export type ComponentProps = React.FC<Props>
