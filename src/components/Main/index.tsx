import React from 'react';
import {Route, Switch} from 'react-router';
import {hot} from 'react-hot-loader';

import Loader from '../Loader';
import Error from '../Error';
import Gate from '../Gate';
import Portal from '../Portal';

import { StyledType } from './Main.types';

const Main: StyledType = () => <Gate>
    <Switch>
        <Route
            component={
                () => <div style={{height: '100%'}}>
                    <Portal />
                    <Loader />
                    <Error />
                </div>
            }
        />
    </Switch>
</Gate>;

export default hot(module)(Main);
