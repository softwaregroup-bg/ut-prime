import React from 'react';
import lodashGet from 'lodash.get';
import ActionButton from '../ActionButton';
import testid from '../lib/testid';
import type {WidgetReference} from '../types';

export default function useButtons({
    selected,
    toolbar,
    properties,
    getValues,
    paramsLayout,
    trigger,
    current,
    loading,
    submit
}: {
    properties: unknown,
    toolbar: false | WidgetReference[],
    paramsLayout?: unknown,
    trigger?: Parameters<typeof ActionButton>[0]['submit'];
    submit?: Parameters<typeof ActionButton>[0]['submit'];
    getValues: Parameters<typeof ActionButton>[0]['getValues'];
    current?: unknown,
    selected: unknown[],
    loading: string
}) {
    const buttons = React.useMemo(() =>
        toolbar && toolbar.length ? toolbar.map((widget, index) => {
            const {
                title,
                icon,
                action,
                method,
                onClick,
                params,
                enabled,
                disabled,
                permission,
                menu,
                confirm,
                successHint,
                tooltip,
                tooltipOptions,
                reactTooltip
            } = typeof widget === 'string' ? properties[widget].widget : widget;

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
                        return selected && selected.length === 1;
                    default:
                        return !!lodashGet(current, criteria);
                }
            };
            const isDisabled = enabled != null ? !check(enabled) : disabled != null ? check(disabled) : undefined;

            return (
                <ActionButton
                    key={index}
                    permission={permission}
                    {...testid(`${permission ? permission + 'Button' : 'button' + index}`)}
                    submit={paramsLayout ? trigger : submit}
                    action={action}
                    method={method}
                    onClick={onClick}
                    params={params}
                    menu={menu}
                    confirm={confirm}
                    getValues={getValues}
                    disabled={!!loading || isDisabled}
                    successHint={successHint}
                    className="mr-2"
                    icon={icon}
                    tooltip={tooltip}
                    tooltipOptions={tooltipOptions}
                    reactTooltip={reactTooltip}
                >
                    {title}
                </ActionButton>
            );
        }) : null,
    [toolbar, properties, paramsLayout, trigger, submit, getValues, loading, current, selected]);

    return buttons;
}
