import React from 'react';
import {Route, Switch} from 'react-router';
import {hot} from 'react-hot-loader';

import SsoPage from 'ut-front-react/components/SsoPage';

import Dashboard from '../Dashboard';
import Loader from '../Loader';
import ErrorPopup from '../ErrorPopup';
import Gate from '../Gate';
import Portal from '../Portal';

import { StyledType } from './Main.types';

const Main: StyledType = () => <Gate>
    <Switch>
        <Route path='/sso/:appId/:ssoOrigin' component={SsoPage} />
        <Route
            component={
                ({location}) => <div style={{height: '100%'}}>
                    <Portal location={location}>
                        <Route exact path='/' component={Dashboard} />
                    </Portal>
                    <Loader />
                    <ErrorPopup />
                </div>
            }
        />
    </Switch>
</Gate>;

export default hot(module)(Main);
