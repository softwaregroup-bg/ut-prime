import React from 'react';
import {Toast} from '../prime';
import type {UtError} from '../types';

const error = message => params => {
    const error: UtError = new Error(message);
    error.print = message;
    throw error;
};
const delay = params => {
    return new Promise(resolve => setTimeout(() => resolve({}), 2000));
};

const sticky = {sticky: false};

export default function useToast(props = sticky) {
    const toast = React.useRef(null);
    const show = React.useCallback(summary => async formData => {
        toast.current.clear();
        toast.current.show({
            severity: 'success',
            summary,
            detail: <pre>{JSON.stringify(formData, (key, value) => (key === 'formData' && value?.values) ? Array.from(value.entries()) : value, 2)}</pre>,
            ...props
        });
        return formData;
    }, [toast, props]);
    return {
        toast: <Toast ref={toast} className='w-auto' style={{maxWidth: 'initial'}}/>,
        error,
        delay,
        submit: show('Submit'),
        show
    };
}
