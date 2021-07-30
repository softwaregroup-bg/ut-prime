import React from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Button } from '../prime';

import Text from '../Text';
import { logout } from '../Login/actions';

import { Styled, StyledType } from './Error.types';
import { State } from '../Store/Store.types';

const selectError = (state: State) => state.error;

const Error: StyledType = ({ classes, message: errorMessage }) => {
    let closable = true;
    let actionButtons;

    const {open, title: header, message, type} = useSelector(selectError);
    const dispatch = useDispatch();
    let handleClose;

    if (type === 'identity.invalidCredentials') {
        handleClose = React.useCallback(() => dispatch(logout()), [dispatch]);
        closable = false;
        actionButtons = <Button label="Login" onClick={handleClose} />;
    } else {
        handleClose = React.useCallback(() => dispatch({type: 'error.close'}), [dispatch]);
        actionButtons = <Button label="Close" onClick={handleClose} />;
    }

    return open ? (
        <Dialog
            visible={open}
            onHide={handleClose}
            breakpoints={{'960px': '75vw', '640px': '95vw'}}
            style={{width: '30vw'}}
            {...{closable, header}}
        >
            <div className={clsx(classes.errorIconWrap, classes.errorIcon)} />
            <div className={classes.errorMessageWrap}>
                <Text>{errorMessage || message}</Text>
            </div>
            <div className={classes.errorButtonWrap}>
                {actionButtons}
            </div>
        </Dialog>
    ) : null;
};

export default Styled(Error);
