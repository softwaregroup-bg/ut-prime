import React from 'react';
import {Toast} from '../prime';

export default function useToast() {
    const toast = React.useRef(null);
    const submit = React.useCallback(formData => toast.current.show({
        severity: 'success',
        summary: 'Submit',
        detail: <pre>{JSON.stringify(formData, null, 2)}</pre>
    }), [toast]);
    return {
        toast: <Toast ref={toast} />,
        submit
    };
};
