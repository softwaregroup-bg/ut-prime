import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

import Text from '../Text';

import { useStyles, ComponentProps } from './Loader.types';
import { State } from '../Store/Store.types';

const Loader: ComponentProps = ({ className, message, open }) => {
    const classes = useStyles();
    const loader = useSelector((state: State) => state?.loader);
    return (
        ((loader && loader.open) || open) && <div className={clsx(classes.loaderContainer, className)}>
            <div className={classes.overlay} />
            <div className={clsx(classes.loader, className)} />
            <div className={classes.message}><Text>{message || loader.message}</Text></div>
        </div>
    ) || null;
};

export default Loader;
