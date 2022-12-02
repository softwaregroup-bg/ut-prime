import React from 'react';
import { useDispatch } from 'react-redux';

import {Toast} from '../prime';
import errorMessage from '../Error/errorMessage';

function call(submit, dispatch, toast, success) {
    return async(...params) => {
        try {
            await submit(...params);
            success && params[0] && dispatch({
                type: 'front.hint.open',
                event: params[0],
                result: success
            });
        } catch (error) {
            if (error.silent) return;
            if (error.statusCode === 401 || !error.print || (!toast?.current && !params[0])) {
                dispatch({
                    type: 'front.error.open',
                    error
                });
            } else if (toast?.current) {
                toast?.current?.show({
                    severity: 'error',
                    detail: <pre style={{whiteSpace: 'pre-line'}}>{errorMessage(error)}</pre>,
                    life: 15000
                });
            } else {
                params[0] && dispatch({
                    type: 'front.hint.open',
                    event: params[0],
                    error
                });
            }
        }
    };
}

export default function useSubmit(submit, dependencies, {success = null} = {}) {
    const dispatch = useDispatch();
    const toast = React.useRef(null);
    return {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        handleSubmit: React.useCallback(call(submit, dispatch, toast, success), dependencies),
        toast: <Toast ref={toast} />
    };
}
