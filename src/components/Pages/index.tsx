import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import './style.css';

import Async from '../Async';

import { StyledType } from './Pages.types';

class Context extends React.Component {
    static childContextTypes = {
        checkPermission: PropTypes.func,
        implementationStyle: PropTypes.object
    }

    getChildContext() {
        return {
            checkPermission: () => true,
            implementationStyle: {}
        };
    }

    render() {
        return this.props.children;
    }
}

const Pages: StyledType = ({ tabs }) =>
    <Context>
        <Switch>
            {
                tabs
                    .filter(tab => tab.component)
                    .map(tab =>
                        <Route
                            key={tab.path}
                            strict
                            path={tab.path}
                            render={() => <Async component={tab.component} />}
                        />
                    )
            }
        </Switch>
    </Context>;

export default Pages;
