import React from 'react';

import Loader from '../Loader';
import Error from '../Error';
import Hint from '../Hint';
import Gate from '../Gate';
import Portal from '../Portal';

import { ComponentProps } from './Main.types';

const Main: ComponentProps = props => <Gate {...props}>
    <div className='border-noround surface-0 h-full'>
        <Portal />
        <Loader />
        <Error />
        <Hint />
    </div>
</Gate>;

export default Main;
