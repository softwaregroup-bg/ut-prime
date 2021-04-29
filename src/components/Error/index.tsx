import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import Text from '../Text';
import { logout } from '../Login/actions';

import { Styled, StyledType } from './Error.types';

const close = () => ({type: 'error.close'});

const Error: StyledType = ({ classes, open, message, close, title: header, type, logout }) => {
    let handleClose = close;
    let closable = true;
    let actionButtons;

    if (type === 'identity.invalidCredentials') {
        handleClose = logout;
        closable = false;
        actionButtons = <Button label="Login" onClick={handleClose} />;
    } else {
        actionButtons = <Button label="Close" onClick={handleClose} />;
    }

    return (
        <Dialog
            visible={open}
            onHide={handleClose}
            breakpoints={{'960px': '75vw', '640px': '95vw'}}
            style={{width: '30vw'}}
            {...{closable, header}}
        >
            <div className={clsx(classes.errorIconWrap, classes.errorIcon)} />
            <div className={classes.errorMessageWrap}>
                <Text>{message}</Text>
            </div>
            <div className={classes.errorButtonWrap}>
                {actionButtons}
            </div>
        </Dialog>
    );
};

export default connect(
    state => state.error,
    {close, logout}
)(Styled(Error));
