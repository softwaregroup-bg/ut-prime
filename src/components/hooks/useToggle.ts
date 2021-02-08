import { useReducer } from 'react';

// https://usehooks.com/useToggle/
export default function useToggle(initialValue = false) {
    return useReducer(state => !state, initialValue);
};
