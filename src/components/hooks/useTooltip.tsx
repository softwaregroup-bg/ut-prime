import { PlacesType, VariantType, WrapperType, PositionStrategy } from 'react-tooltip';
import type TooltipOptions from 'primereact/tooltip/tooltipoptions';
import useText from './useText';

interface DataAttributes {
    'data-tooltip-id'?: string;
    'data-tooltip-place'?: PlacesType;
    'data-tooltip-content'?: string;
    'data-tooltip-html'?: string;
    'data-tooltip-variant'?: VariantType;
    'data-tooltip-offset'?: number;
    'data-tooltip-wrapper'?: WrapperType;
    'data-tooltip-position-strategy'?: PositionStrategy;
    'data-tooltip-delay-show'?: number;
    'data-tooltip-delay-hide'?: number;
    'data-tooltip-float'?: boolean;
    'data-tooltip-hidden'?: boolean;
}

export interface HookParams {
    tooltip?: string;
    reactTooltip?: boolean | DataAttributes;
    tooltipOptions?: TooltipOptions;
}

export default function useTooltip({ tooltip: text, tooltipOptions, reactTooltip }: HookParams): DataAttributes & TooltipOptions {
    const type = typeof reactTooltip;
    const translatedTooltip = useText({ text });

    const reactTooltipProps = (type === 'object' || reactTooltip) ? {
        'data-tooltip-id': 'utPrime-react-tooltip',
        'data-tooltip-content': translatedTooltip,
        'data-tooltip-place': 'bottom',
        ...(type === 'object' && (reactTooltip as object))
    } as DataAttributes : {};

    const tooltipProps = !reactTooltip ? {
        tooltip: translatedTooltip,
        tooltipOptions: { position: 'bottom', ...tooltipOptions }
    } : {};

    return { ...reactTooltipProps, ...tooltipProps };
}
