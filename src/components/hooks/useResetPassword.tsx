import React from 'react';
import { Toast } from '../prime';
import errorMessage from '../Error/errorMessage';
import { useDispatch } from 'react-redux';

function call(submit, dispatch, toast) {
    return async(...params) => {
        try {
            await submit(...params);
        } catch (error) {
            if (error.statusCode === 401 || !error.print || !toast?.current) {
                dispatch({
                    type: 'front.error.open',
                    error
                });
            } else {
                toast?.current?.show({
                    severity: 'error',
                    detail: <pre style={{ whiteSpace: 'pre-line' }}>{errorMessage(error)}</pre>,
                    life: 15000
                });
            }
        }
    };
}

export default function useResetPassword(submit, dependencies) {
    const dispatch = useDispatch();
    const toast = React.useRef(null);
    return {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        handleResetPassword: React.useCallback(call(submit, dispatch, toast), dependencies),
        toastResetPassword: <Toast ref={toast} />
    };
}
