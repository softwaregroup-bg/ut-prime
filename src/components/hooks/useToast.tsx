import React from 'react';
import {Toast} from '../prime';

export default function useToast(props) {
    const toast = React.useRef(null);
    const submit = React.useCallback(async formData => {
        toast.current.clear();
        toast.current.show({
            severity: 'success',
            summary: 'Submit',
            detail: <pre>{JSON.stringify(formData, null, 2)}</pre>,
            ...props
        });
        return formData;
    }, [toast, props]);
    return {
        toast: <Toast ref={toast}/>,
        submit
    };
}
