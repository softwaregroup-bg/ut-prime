import { HTMLAttributes } from 'react';

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
    className?: string;
    button?: string;
    sizeType?: string;
    fullWidth?: boolean;
}
