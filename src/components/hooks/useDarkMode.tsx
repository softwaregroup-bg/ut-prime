import React from 'react';
import useLocalStorage from './useLocalStorage';
import useMedia from './useMedia';

import {Button} from '../prime';

function usePrefersDarkMode() {
    return useMedia(['(prefers-color-scheme: dark)'], [true], !window.matchMedia);
}

// https://usehooks.com/useDarkMode/
function useDarkMode() {
    // Use our useLocalStorage hook to persist state through a page refresh.
    // Read the recipe for this hook to learn more: https://usehooks.com/useLocalStorage
    const [enabledState, setEnabledState] = useLocalStorage<boolean>(
        'dark-mode-enabled',
        null
    );
    // See if user has set a browser or OS preference for dark mode.
    // The usePrefersDarkMode hook composes a useMedia hook (see code below).
    const prefersDarkMode = usePrefersDarkMode();
    // If enabledState is defined use it, otherwise fallback to prefersDarkMode.
    // This allows user to override OS level setting on our website.
    const enabled = enabledState ?? prefersDarkMode;
    const Switch = React.useMemo(() => function Switch() {
        return <Button key='switch' icon={enabled ? 'pi pi-sun' : 'pi pi-moon'} onClick={() => setEnabledState(prev => !prev)} />;
    }, [enabled, setEnabledState]);
    return [enabled, Switch];
}
export default useDarkMode;
