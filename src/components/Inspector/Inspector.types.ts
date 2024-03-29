import React from 'react';
import {ComponentProps as Editor} from '../Editor/Editor.types';

export interface Props {
    Editor: Editor;
    className?: string;
    object: object;
    property: string | string[];
    where: 'schema' | 'card';
    type: 'field' | 'card' | 'column';
    onChange?: (params: object) => void
}

export type ComponentProps = React.FC<Props>
