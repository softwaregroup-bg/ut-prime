import React from 'react';
import classnames from 'classnames';

import { IButtonProps } from './Button.types';
import style from './Button.css';

const Button: React.FC<IButtonProps> = ({ className, children, button, sizeType, fullWidth = false, ...props }) => {
    function getStyle(name) {
        // todo theming
        // return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
        return style[name];
    }

    let sizeTypeClass;

    switch (sizeType) {
        case 'small':
            sizeTypeClass = getStyle('btnSmall');
            break;
        default:
            sizeTypeClass = getStyle('btnNormal');
    }
    const fullWidthClass = fullWidth ? getStyle('btnFullWidth') : null;
    let typeClass;
    switch (button) {
        case 'add':
        case 'import':
        case 'save':
        case 'send':
        case 'validate':
            typeClass = getStyle('btnGreen');
            break;
        case 'back':
        case 'cancel':
        case 'reset':
        case 'retake':
            typeClass = getStyle('btnGrey');
            break;
        case 'connection':
        case 'next':
            typeClass = getStyle('btnPink');
            break;
        case 'end':
            typeClass = getStyle('btnGreyDark');
            break;
        case 'validate-file':
            typeClass = getStyle('btnValidateFile');
            break;
        case 'reject-file':
            typeClass = getStyle('btnRejectFile');
            break;
        case 'close':
            typeClass = getStyle('btnClose');
            break;
        case 'close-page':
            typeClass = getStyle('btnClosePage');
            break;
        case 'custom':
            typeClass = getStyle('btnCustom');
            break;
        default:
            typeClass = getStyle('btnGreen');
    }
    let classes = classnames(getStyle('btn'), sizeTypeClass, typeClass, fullWidthClass);
    if (button === 'custom') {
        classes = typeClass;
    }
    return (
        <button type='button' className={classes} tabIndex={0} {...props}>{children}</button>
    );
};

export default Button;
