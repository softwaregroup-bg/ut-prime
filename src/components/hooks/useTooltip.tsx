import React from 'react';
import { Tooltip } from 'react-tooltip';
import useText from './useText';

export interface HookParams {
    tooltip?: string,
    tooltipOptions?: Omit<Parameters<typeof Tooltip>[0], 'children'> | boolean,
    id?: string,
    testId?: string
}

interface HookResult {
    tooltip?: React.ReactNode,
    translatedTooltip?: string
}

export default function useAllow({tooltip: text, tooltipOptions, id, testId}: HookParams): HookResult {
    const type = typeof tooltipOptions;
    const translatedTooltip = useText({ text });
    const anchorSelect = React.useMemo(() => {
        if (testId) {
            return `[data-testid='${testId}']`;
        } else if (id) {
            return `#${id}`;
        }
    }, [id, testId]);
    const tooltip = translatedTooltip && anchorSelect && <Tooltip
        className="z-2" // because table header has z-index: 1
        anchorSelect={anchorSelect}
        content={translatedTooltip}
        place={'bottom'}
        {...type === 'object' && tooltipOptions as object}
    />;

    return { tooltip, translatedTooltip };
}
