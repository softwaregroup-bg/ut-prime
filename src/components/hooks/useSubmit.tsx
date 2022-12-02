import React from 'react';
import { useDispatch } from 'react-redux';

import {Toast} from '../prime';
import errorMessage from '../Error/errorMessage';

function call(submit, dispatch, toast, content) {
    return async(...params) => {
        try {
            await submit(...params);
            content && params[0] && dispatch({
                type: 'front.hint.open',
                event: params[0],
                content
            });
        } catch (error) {
            if (error.statusCode === 401 || !error.print || !toast?.current) {
                dispatch({
                    type: 'front.error.open',
                    error
                });
            } else {
                toast?.current?.show({
                    severity: 'error',
                    detail: <pre style={{whiteSpace: 'pre-line'}}>{errorMessage(error)}</pre>,
                    life: 15000
                });
            }
        }
    };
}

export default function useSubmit(submit, dependencies, {overlay = null} = {}) {
    const dispatch = useDispatch();
    const toast = React.useRef(null);
    return {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        handleSubmit: React.useCallback(call(submit, dispatch, toast, overlay), dependencies),
        toast: <Toast ref={toast} />
    };
}
