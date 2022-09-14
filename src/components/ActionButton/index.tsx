import React from 'react';
import {useDispatch} from 'react-redux';

import {Button} from '../prime';

import {ComponentProps} from './ActionButton.types';

const ActionButton: ComponentProps = ({getValues, action, params, ...props}) => {
    const dispatch = useDispatch();
    const handleClick = React.useMemo(() => event => {
        event.preventDefault();
        if (typeof action === 'function') return action(getValues?.());
        dispatch({
            type: 'front.button.action',
            method: 'handle.action',
            params: [{action, params}, getValues?.()]
        });
    }, [action, params, dispatch, getValues]);
    return <Button onClick={handleClick} {...props} />;
};

export default ActionButton;
