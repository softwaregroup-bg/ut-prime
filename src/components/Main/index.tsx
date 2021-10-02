import React from 'react';

import Loader from '../Loader';
import Error from '../Error';
import Gate from '../Gate';
import Portal from '../Portal';

import { StyledType } from './Main.types';

const Main: StyledType = props => <Gate {...props}>
    <div className='border-noround surface-0 h-full'>
        <Portal />
        <Loader />
        <Error />
    </div>
</Gate>;

export default Main;
