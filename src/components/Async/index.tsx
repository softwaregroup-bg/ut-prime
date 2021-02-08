import React from 'react';

import { StyledType, asyncComponent, asyncComponentParams } from './Async.types';

// adapted from https://usehooks.com/useAsync/
const useAsync = (asyncFunction: asyncComponent, params: asyncComponentParams) => {
    const [status, setStatus] = React.useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [value, setValue] = React.useState<{component: React.FC}>(null);
    const [error, setError] = React.useState<Error>(null);

    // The execute function wraps asyncFunction and
    // handles setting state for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = React.useCallback(async() => {
        setStatus('pending');
        setValue(null);
        setError(null);
        try {
            setValue({component: await asyncFunction(params)});
            setStatus('success');
        } catch (error) {
            setError(error);
            setStatus('error');
        }
    }, [asyncFunction, params]);

    React.useEffect(() => {
        execute();
    }, [execute]);

    return { execute, status, Component: value && value.component, error };
};

const Async: StyledType = ({component, params, children}) => {
    const { status, Component, error } = useAsync(component, params);
    switch (status) {
        case 'error': return <div>{JSON.stringify(error)}</div>;
        case 'success': return <Component {...params}>{children}</Component>;
        default: return <div>Loading...</div>;
    }
};

export default Async;
