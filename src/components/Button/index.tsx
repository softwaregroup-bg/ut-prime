import React from 'react';
import clsx from 'clsx';
import {createUseStyles} from 'react-jss';

import { ComponentProps } from './Button.types';

const useStyles = createUseStyles({
    btn: {
        textTransform: 'uppercase',
        fontSize: 14,
        color: '#FFFFFF',
        borderRadius: 2,
        border: 0,
        fontWeight: 600,
        '&:focus': {
            outline: '5px auto -webkit-focus-ring-color',
            fallbacks: {
                outline: '1px dotted #014c8c'
            }
        },
        '&:disabled': {
            backgroundColor: '#F2F2F2',
            cursor: 'pointer'
        },
        '&:disabled:hover': {
            backgroundColor: '#F2F2F2',
            cursor: 'pointer'
        }
    },
    btnNormal: {
        width: 146,
        height: 46
    },
    btnSmall: {
        fontSize: 11,
        lineHeight: '11px',
        padding: '8px 10px'
    },
    btnFullWidth: {
        width: '100%'
    },
    btnGreen: {
        backgroundColor: '#7EC241',
        '&:hover': {
            backgroundColor: '#72A73F'
        }
    },
    btnPink: {
        backgroundColor: '#0074ba',
        '&:hover': {
            backgroundColor: '#0067a6'
        }
    },
    btnGrey: {
        backgroundColor: '#D2D5D6',
        '&:hover': {
            backgroundColor: '#777E7D'
        }
    },
    btnGreyDark: {
        backgroundColor: '#4D525A',
        '&:hover': {
            backgroundColor: '#384044'
        }
    },
    btnClose: {
        width: 15,
        height: 15,
        color: 'transparent',
        overflow: 'hidden',
        padding: 0,
        '&:hover': {
            width: 15,
            height: 15,
            color: 'transparent',
            overflow: 'hidden',
            padding: 0
        }
    },
    btnClosePage: {
        width: 40,
        height: 31,
        color: 'transparent',
        overflow: 'hidden',
        '&:hover': {
            fontWeight: 'normal'
        }
    },
    btnValidateFile: {
        paddingLeft: 30,
        paddingRight: 10,
        backgroundColor: '#FFFFFF',
        border: '1px solid #7EC241',
        color: '#7EC241',
        '&:hover': {
            backgroundColor: '#72A73F',
            color: '#FFFFFF'
        }
    },
    btnRejectFile: {
        paddingLeft: 30,
        paddingRight: 10,
        backgroundColor: '#FFFFFF',
        border: '1px solid #EA4949',
        color: '#EA4949',
        '&:hover': {
            backgroundColor: '#EA4949',
            color: '#FFFFFF'
        }
    },
    btnCustom: {
        background: 'none',
        border: 'none'
    }
});

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
