import React from 'react';
import lodashGet from 'lodash.get';
import ActionButton from '../ActionButton';
import testid from '../lib/testid';

export default function useButtons({ selected, buttonsProps, properties, methods, setFilters, getValues, paramsLayout, trigger, current, loading, setLoading, submit }) {
    const buttons = React.useMemo(
        () =>
            (buttonsProps || []).map((widget, index) => {
                const {
                    title,
                    icon,
                    action,
                    method,
                    enabled,
                    disabled,
                    permission,
                    menu,
                    confirm,
                    successHint,
                    ...otherProps
                } = typeof widget === 'string' ? properties[widget].widget : widget;
                let params = otherProps?.params;

                const check = (criteria) => {
                    if (typeof criteria?.validate === 'function') {
                        return !criteria.validate({ current, selected }).error;
                    }
                    if (typeof criteria !== 'string') return !!criteria;
                    switch (criteria) {
                        case 'current':
                            return !!current;
                        case 'selected':
                            return selected && selected.length > 0;
                        case 'single':
                            return selected && selected;
                        default:
                            return !!lodashGet(current, criteria);
                    }
                };
                const isDisabled = enabled != null ? !check(enabled) : disabled != null ? check(disabled) : undefined;

                if (current === null && typeof params === 'string' && params === 'selected') {
                    params = selected;
                }

                return (
                    <ActionButton
                        key={index}
                        permission={permission}
                        {...testid(`${permission ? permission + 'Button' : 'button' + index}`)}
                        submit={paramsLayout ? trigger : submit}
                        action={action}
                        method={method}
                        params={params}
                        menu={menu}
                        confirm={confirm}
                        getValues={getValues}
                        disabled={!!loading || isDisabled}
                        successHint={successHint}
                        className="p-button mr-2"
                        icon={icon}
                    >
                        {title}
                    </ActionButton>
                );
            }),
        [buttonsProps, properties, paramsLayout, trigger, submit, getValues, loading, current, selected]
    );

    return buttons;
}
