import React from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {Button} from '../prime';

import {ComponentProps} from './ActionButton.types';

const ActionButton: ComponentProps = ({getValues, action, params, ...props}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const handleClick = React.useMemo(() => event => {
        event.preventDefault();
        if (typeof action === 'function') return action(getValues?.());
        if (action === 'link') return history.push(params);
        dispatch({
            type: 'front.button.action',
            method: 'handle.action',
            params: [{action, params}, getValues?.()]
        });
    }, [action, params, dispatch, getValues, history]);
    return <Button onClick={handleClick} {...props} />;
};

export default ActionButton;
