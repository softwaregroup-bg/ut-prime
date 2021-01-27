import React from 'react';
import { connect } from 'react-redux';

import Text from '../Text';

import { addTab } from './actions';
import { StyledType } from './AddTab.types';

const AddTab: StyledType = ({ addTab, pathname, title, pagename, shouldUpdate, onUnmount }) => {
    React.useEffect(() => {
        addTab(pathname, <Text>{title}</Text>, pathname === '/', pagename, shouldUpdate);
        return function cleanup() {
            onUnmount && onUnmount();
        };
    }, []);

    return <></>;
};

export default connect(
    false,
    {addTab}
)(AddTab);
