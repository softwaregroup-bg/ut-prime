import React from 'react';
import { useDispatch } from 'react-redux';

import {Toast} from '../prime';
import errorMessage from '../Error/errorMessage';
import debounce from 'lodash.debounce';

function call(submit, dispatch, toast, success) {
    return async(...params) => {
        try {
            const result = await submit(...params);
            success && params[0] && dispatch({
                type: 'front.hint.open',
                event: params[0],
                result: success
            });
            return result;
        } catch (error) {
            if (error.silent || error.message === 'silent') return;
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

export function useSubmit(submit, dependencies, {success = null} = {}) {
    const dispatch = useDispatch();
    const toast = React.useRef(null);
    return {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        handleSubmit: React.useCallback(call(submit, dispatch, toast, success), dependencies),
        toast: <Toast ref={toast} />
    };
}

export function useDebounce(submit, dependencies, {success = null} = {}) {
    const dispatch = useDispatch();
    const toast = React.useRef(null);
    const callRef = React.useRef((...params) => {});
    callRef.current = call(submit, dispatch, toast, success);
    const debounced = React.useRef(debounce((...params) => callRef.current?.(...params), 350)).current;

    return {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        handleSubmit: React.useCallback((...params) => debounced(...params), dependencies),
        toast: <Toast ref={toast} />
    };
}
