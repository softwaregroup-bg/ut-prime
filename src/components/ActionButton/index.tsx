import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {Button, Menu} from '../prime';
import filterMenu from '../lib/filterMenu';
import {State} from '../Store/Store.types';
import useSubmit from '../hooks/useSubmit';

import {ComponentProps} from './ActionButton.types';

const ActionButton: ComponentProps = ({getValues, onClick: click, action, method, params, menu, submit, successHint: success, ...props}) => {
    const menuRef = React.useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const permissions = useSelector(({login}: State) => login).result?.['permission.get'] || false;
    const {handleSubmit: perform} = useSubmit(async(event, performMethod, performAction, performParams) => {
        if (click) return click(event);
        if (performMethod) {
            event.method = performMethod;
            event.params = performParams;
            return await submit(event);
        }
        if (typeof performAction === 'function') return performAction(getValues?.());
        if (performAction === 'link') return history.push(performParams);
        dispatch({
            type: 'front.button.action',
            method: 'handle.action',
            params: [{event, action: performAction, params: performParams}, getValues?.()]
        });
    }, [dispatch, getValues, history, submit, click], {success});
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
    const onClick = React.useCallback(event => model ? menuRef.current.toggle(event) : handleClick(event), [model, handleClick]);
    if (model && !model.length) return null; // no permissions
    return model ? <>
        <Menu popup model={model} ref={menuRef}/>
        <Button onClick={onClick} {...props} icon="pi pi-angle-down p-button-icon-right" />
    </> : <Button onClick={onClick} {...props} />;
};

export default ActionButton;
