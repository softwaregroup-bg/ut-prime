import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {Button, Menu} from '../prime';
import filterMenu from '../lib/filterMenu';
import {State} from '../Store/Store.types';

import {ComponentProps} from './ActionButton.types';

const ActionButton: ComponentProps = ({getValues, action, method, params, menu, submit, ...props}) => {
    const menuRef = React.useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const permissions = useSelector(({login}: State) => login).result?.['permission.get'] || false;
    const perform = React.useCallback((event, performMethod, performAction, performParams) => {
        if (performMethod) {
            event.method = performMethod;
            event.params = performParams;
            return submit(event);
        }
        if (typeof performAction === 'function') return performAction(getValues?.());
        if (performAction === 'link') return history.push(performParams);
        dispatch({
            type: 'front.button.action',
            method: 'handle.action',
            params: [{action: performAction, params: performParams}, getValues?.()]
        });
    }, [dispatch, getValues, history, submit]);
    const handleClick = React.useMemo(() => event => {
        event.preventDefault();
        perform(event, method, action, params);
    }, [method, action, params, perform]);
    const model = React.useMemo(() => filterMenu(
        permissions,
        event => {
            perform(event, event.item.method, event.item.action, event.item.params);
        },
        menu
    ), [perform, menu, permissions]);
    return model ? <>
        <Menu popup model={model} ref={menuRef}/>
        <Button onClick={event => menuRef.current.toggle(event)} {...props} icon="pi pi-angle-down" iconPos="right" />
    </> : <Button onClick={handleClick} {...props} />;
};

export default ActionButton;
