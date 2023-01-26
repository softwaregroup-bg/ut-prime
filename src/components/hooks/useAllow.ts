import { useCallback, useRef } from 'react';

export default function useAllow(card, formApi, props) {
    const formValuesRef = useRef(); // cached values during same render
    formValuesRef.current = null;
    const values = useCallback(() => {
        formValuesRef.current = formValuesRef.current || formApi.getValues();
        return formValuesRef.current;
    }, [formApi]);
    let cardDisabled = card?.disabled ?? props.disabled;
    if (typeof cardDisabled === 'object' && 'validate' in cardDisabled) cardDisabled = !cardDisabled.validate(values()).error;
    let cardEnabled = card?.enabled ?? props.enabled;
    if (typeof cardEnabled === 'object' && 'validate' in cardEnabled) cardEnabled = !cardEnabled.validate(values()).error;

    return useCallback(widget => {
        let disabled = widget.disabled ?? cardDisabled;
        if (disabled?.validate) disabled = !disabled.validate(values()).error;
        let enabled = widget.enabled ?? cardEnabled;
        if (enabled?.validate) enabled = !enabled.validate(values()).error;
        return {
            ...disabled != null && {disabled},
            ...enabled != null && {enabled}
        };
    }, [cardEnabled, cardDisabled, values]);
}
