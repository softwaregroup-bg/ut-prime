import { useReducer } from 'react';

// https://usehooks.com/useToggle/
const toggle = state => !state;

export default function useToggle(initialValue = false) {
    return useReducer(toggle, initialValue);
};
