import React from 'react';
import { Props as StoreProps } from '../Store/Store.types';
import type { Theme } from '../Theme';

export interface Props extends StoreProps, React.HTMLAttributes<HTMLDivElement> {
    /**
     * Theme parameters
     */
    theme: Theme,
    customization?: boolean,
    portalName: string,
    extraTitleComponent?: string,
    loginTitleComponent?: string,
    devTool?: boolean,
    homePage?: string,
    loginPage?: string,
    registrationPage?: string
}

export type ComponentProps = React.FC<Props>
