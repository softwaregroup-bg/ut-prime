import React from 'react';
import { Tooltip } from 'react-tooltip';
import useText from 'ut-prime/src/components/hooks/useText';

export interface HookParams {
    tooltip?: string,
    tooltipOptions?: Omit<Parameters<typeof Tooltip>[0], 'children'> | boolean
}

interface HookResult {
    tooltipId?: string,
    tooltip?: React.ReactNode,
    tooltipText?: string
}

export default function useAllow({tooltip: text, tooltipOptions}: HookParams): HookResult {
    const type = typeof tooltipOptions;
    const translatedTooltip = useText({ text });
    const tooltipId = React.useMemo(() => {
        if (type !== 'undefined' && translatedTooltip) {
            return String(Math.floor(100000000 + Math.random() * 900000000));
        }
    }, [type, translatedTooltip]);
    const tooltip = tooltipId && <Tooltip
        className="z-2" // because table header has z-index: 1
        id={tooltipId}
        content={translatedTooltip}
        place={'bottom'}
        {...type === 'object' && tooltipOptions as object}
    />;

    return { tooltipId, tooltip, tooltipText: translatedTooltip };
}
