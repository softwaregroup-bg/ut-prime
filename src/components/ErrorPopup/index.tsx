import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { Popup } from 'devextreme-react/popup';
import { Button } from 'devextreme-react/button';

import Text from '../Text';
import { logout } from '../login/actions';

import { Styled, StyledType } from './ErrorPopup.types';

const close = () => ({type: 'error.close'});

const ErrorPopup: StyledType = ({ classes, open, message, close, title, type, logout }) => {
    let handleClose = close;
    let showCloseButton = true;
    let actionButtons;

    if (type === 'identity.invalidCredentials') {
        handleClose = logout;
        showCloseButton = false;
        actionButtons = <Button
            width={120}
            text="Login"
            type="default"
            stylingMode="contained"
            onClick={handleClose}
        />;
    } else {
        actionButtons = <Button
            width={120}
            text="Close"
            type="default"
            stylingMode="contained"
            onClick={handleClose}
        />;
    }

    return (
        <Popup
            visible={open}
            minWidth={540}
            width='auto'
            height='auto'
            onHidden={handleClose}
            {...{showCloseButton, title}}
        >
            <div className={clsx(classes.errorIconWrap, classes.errorIcon)} />
            <div className={classes.errorMessageWrap}>
                <Text>{message}</Text>
            </div>
            <div className={classes.errorButtonWrap}>
                {actionButtons}
            </div>
        </Popup>
    );
};

export default connect(
    state => state.errorPopup,
    {close, logout}
)(Styled(ErrorPopup));
