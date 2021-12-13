import React from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Button } from '../prime';

import Text from '../Text';
import { logout } from '../Login/actions';

import { Styled, StyledType } from './Error.types';
import { State } from '../Store/Store.types';

const selectError = (state: State) => state.error;
const breakpoints = {'960px': '75vw', '640px': '95vw'};
const width = {width: '30vw'};

const Error: StyledType = ({ classes, message: errorMessage }) => {
    let closable = true;
    let actionButtons;

    const {open, title: header, message, type, statusCode} = useSelector(selectError);
    const dispatch = useDispatch();
    const unauthorized = (type === 'identity.invalidCredentials') || (statusCode === 401);
    const handleClose = React.useCallback(() => dispatch(unauthorized ? logout() : {type: 'front.error.close'}), [dispatch, unauthorized]);

    if (unauthorized) {
        closable = false;
        actionButtons = <Button label="Login" onClick={handleClose} />;
    } else {
        actionButtons = <Button label="Close" onClick={handleClose} />;
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
                <Text>{errorMessage || message}</Text>
            </div>
            <div className={classes.errorButtonWrap}>
                {actionButtons}
            </div>
        </Dialog>
    ) : null;
};

export default Styled(Error);
