import React from 'react';

import type {WidgetReference} from '../types';
import type { Props as ExplorerProps } from '../Explorer/Explorer.types';

export interface Props {
    name: string,
    hidden?: boolean,
    resultSet?: ExplorerProps['resultSet'],
    schema: ExplorerProps['schema'],
    params: WidgetReference[],
    init?: Record<string, unknown>,
    columns: WidgetReference[],
    design?: ExplorerProps['design'],
    methods?: object;
    table?: ExplorerProps['table'],
    toolbar?: ExplorerProps['toolbar'],
    onDropdown: ExplorerProps['onDropdown'],
    onCustomization?: ExplorerProps['onCustomization'],
    fetch: ExplorerProps['fetch'];
}

export type ComponentProps = React.FC<Props>
