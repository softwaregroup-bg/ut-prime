import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

import Text from '../Text';

import { Styled, StyledType } from './Loader.types';

const Loader: StyledType = ({ classes, className }) => {
    const loader = useSelector(state => state?.loader?.toJS?.());
    return (
        loader && loader.open && <div className={clsx(classes.loaderContainer, className)}>
            <div className={classes.overlay} />
            <div className={clsx(classes.loader, className)} />
            <div className={classes.message}><Text>{loader.message}</Text></div>
        </div>
    ) || null;
};

export default Styled(Loader);
