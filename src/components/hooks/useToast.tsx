import React from 'react';
import {Toast} from '../prime';

export default function useToast(props) {
    const toast = React.useRef(null);
    const submit = React.useCallback(formData => {
        toast.current.clear();
        toast.current.show({
            severity: 'success',
            summary: 'Submit',
            detail: <pre>{JSON.stringify(formData, null, 2)}</pre>,
            ...props
        });
    }, [toast, props]);
    return {
        toast: <Toast ref={toast}/>,
        submit
    };
};
