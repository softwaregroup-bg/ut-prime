import { Tooltip } from 'react-tooltip';
import useText from './useText';

export interface HookParams {
    tooltip?: string,
    tooltipOptions?: Omit<Parameters<typeof Tooltip>[0], 'children'> | boolean
}

interface HookResult {
    tooltipParams?: object, //todo: data-tooltip attributes
    translatedTooltip?: string
}

export default function useTooltip({tooltip: text, tooltipOptions}: HookParams): HookResult {
    const type = typeof tooltipOptions;
    const translatedTooltip = useText({ text });

    const tooltipParams = {
        'data-tooltip-id': 'utPrime-react-tooltip',
        'data-tooltip-content': translatedTooltip,
        'data-tooltip-place': 'bottom',
        ...type === 'object' && tooltipOptions as object
    };

    return { tooltipParams, translatedTooltip };
}
