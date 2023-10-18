import PropTypes from 'prop-types';
import { Component } from 'react';

class Permission extends Component {
    static childContextTypes = {
        translate: PropTypes.func,
        money: PropTypes.func,
        dateFormat: PropTypes.func,
        numberFormat: PropTypes.func,
        checkPermission: PropTypes.func,
        implementationStyle: PropTypes.object
    };

    getChildContext() {
        return {
            translate: text => text,
            dateFormat: text => text,
            numberFormat: text => text,
            checkPermission: action => true,
            money: text => text,
            implementationStyle: {}
        };
    }

    render() {
        return this.props.children;
    }
}

export default Permission;
