import React from 'react';
import clsx from 'clsx';

import { useStyles, ComponentProps } from './Button.types';

const Button: ComponentProps = ({ children, button, sizeType, fullWidth = false, ...props }) => {
    let classes = useStyles();
    let sizeTypeClass;

    switch (sizeType) {
        case 'small':
            sizeTypeClass = classes.btnSmall;
            break;
        default:
            sizeTypeClass = classes.btnNormal;
    }
    const fullWidthClass = fullWidth ? classes.btnFullWidth : null;
    let typeClass;
    switch (button) {
        case 'add':
        case 'import':
        case 'save':
        case 'send':
        case 'validate':
            typeClass = classes.btnGreen;
            break;
        case 'back':
        case 'cancel':
        case 'reset':
        case 'retake':
            typeClass = classes.btnGrey;
            break;
        case 'connection':
        case 'next':
            typeClass = classes.btnPink;
            break;
        case 'end':
            typeClass = classes.btnGreyDark;
            break;
        case 'validate-file':
            typeClass = classes.btnValidateFile;
            break;
        case 'reject-file':
            typeClass = classes.btnRejectFile;
            break;
        case 'close':
            typeClass = classes.btnClose;
            break;
        case 'close-page':
            typeClass = classes.btnClosePage;
            break;
        case 'custom':
            typeClass = classes.btnCustom;
            break;
        default:
            typeClass = classes.btnGreen;
    }
    if (button === 'custom') {
        classes = typeClass;
    }
    return (
        <button type='button' className={clsx(classes.btn, sizeTypeClass, typeClass, fullWidthClass)} tabIndex={0} {...props}>{children}</button>
    );
};

export default Button;
