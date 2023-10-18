import React from 'react';
import {Route, Switch} from 'react-router';
import { Tooltip } from 'react-tooltip';

import Permission from './Permission';

import Loader from '../Loader';
import Error from '../Error';
import Hint from '../Hint';
import Gate from '../Gate';
import Portal from '../Portal';
import Page from '../Page';
import { ConfirmPopup, ConfirmDialog } from '../prime';

import { ComponentProps } from './Main.types';

const Main: ComponentProps = props => <Gate {...props}>
    <ConfirmPopup />
    <ConfirmDialog />
    <Tooltip
        id="utPrime-react-tooltip"
        className="p-component z-2" // because table header has z-index: 1
    />
    <Permission>
        <Switch>
            <Route path='/p/:path*' component={Page}/>
            <Route>
                <div className='border-noround surface-0 h-full'>
                    <Portal />
                </div>
            </Route>
        </Switch>
        <Loader />
        <Error />
        <Hint />
    </Permission>
</Gate>;

export default Main;
