import React from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Button } from '../prime';

import Text from '../Text';
import { logout } from '../Login/actions';

import { useStyles, ComponentProps } from './Error.types';
import { State } from '../Store/Store.types';

const selectError = (state: State) => state.error;
const breakpoints = {'960px': '75vw', '640px': '95vw'};
const width = {width: '30vw'};

const Error: ComponentProps = ({ message: errorMessage, params: errorParams }) => {
    const classes = useStyles();
    let closable = true;
    let actionButtons;

    const {open, title: header, message, type, statusCode, params, details} = useSelector(selectError);
    const dispatch = useDispatch();
    const unauthorized = (type === 'identity.invalidCredentials') || (statusCode === 401);
    const handleClose = React.useCallback(() => dispatch(unauthorized ? logout() : {type: 'front.error.close'}), [dispatch, unauthorized]);

    if (unauthorized) {
        closable = false;
        actionButtons = <Button aria-label='Login' onClick={handleClose}>Login</Button>;
    } else {
        actionButtons = <Button aria-label='Close' onClick={handleClose}>Close</Button>;
    }

    return open ? (
        <Dialog
            visible={open}
            onHide={handleClose}
            breakpoints={breakpoints}
            style={width}
            {...{closable, header}}
        >
            <div className={clsx(classes.errorIconWrap, classes.errorIcon)} />
            <div className={classes.errorMessageWrap}>
                <Text params={errorParams || params}>{errorMessage || message}</Text>
            </div>
            <div className={classes.errorButtonWrap}>
                {actionButtons}
            </div>
            {details ? <div>
                {details}
            </div> : null}
        </Dialog>
    ) : null;
};

export default Error;
