import React from 'react';
import { useDispatch } from 'react-redux';

async function call(callback, dispatch) {
    try {
        await callback();
    } catch (error) {
        dispatch({
            type: 'front.error.open',
            error
        });
    };
}

export default function useLoad(callback, dependencies = []) {
    const dispatch = useDispatch();
    React.useEffect(() => {
        call(callback, dispatch);
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}
