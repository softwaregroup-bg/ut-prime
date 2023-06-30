import React from 'react';
import { Tooltip } from 'react-tooltip';
import useText from 'ut-prime/src/components/hooks/useText';

export interface HookParams {
    tooltip?: string,
    tooltipOptions?: Omit<Parameters<typeof Tooltip>[0], 'children'>
}

interface HookResult {
    tooltipId?: string,
    tooltip?: React.ReactNode
}

const empty = {};

export default function useAllow({tooltip: text, tooltipOptions = empty}: HookParams): HookResult {
    const translatedTooltip = useText({ text });
    const tooltipId = React.useMemo(() => {
        if (translatedTooltip) {
            return String(Math.floor(100000000 + Math.random() * 900000000));
        }
    }, [translatedTooltip]);
    const tooltip = tooltipId && <Tooltip
        className="z-2" // because table header has z-index: 1
        id={tooltipId}
        content={translatedTooltip}
        place={'bottom'}
        {...tooltipOptions}
    />;

    return { tooltipId, tooltip };
}
