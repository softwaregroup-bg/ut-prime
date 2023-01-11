import React from 'react';
import {ButtonProps} from '../prime';

export interface Props extends Omit<ButtonProps, 'value' | 'onChange'> {
    value: [Date, Date];
    exclusive?: boolean;
    timeOnly?: boolean;
    inline?: boolean;
    onChange?: (event: {value: [Date, Date]}) => void;
}

export type ComponentProps = React.FC<Props>
