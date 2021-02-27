import React from 'react';
import {hot} from 'react-hot-loader';

import Loader from '../Loader';
import Error from '../Error';
import Gate from '../Gate';
import Portal from '../Portal';

import { StyledType } from './Main.types';

const Main: StyledType = () => <Gate>
    <div style={{height: '100%'}}>
        <Portal />
        <Loader />
        <Error />
    </div>
</Gate>;

export default hot(module)(Main);
