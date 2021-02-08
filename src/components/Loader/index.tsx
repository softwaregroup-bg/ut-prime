import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import Text from '../Text';

import { Styled, StyledType } from './Loader.types';

const Loader: StyledType = ({ classes, className, loadInfo = { message: 'Loading, please wait...', open: false } }) => {
    return (
        loadInfo && loadInfo.open && <div className={clsx(classes.loaderContainer, className)}>
            <div className={classes.overlay} />
            <div className={clsx(classes.loader, className)} />
            <div className={classes.message}><Text>{loadInfo.message}</Text></div>
        </div>
    );
};

export default connect(({ preloadWindow }) => {
    return {
        loadInfo: preloadWindow && preloadWindow.toJS()
    };
})(Styled(Loader));
