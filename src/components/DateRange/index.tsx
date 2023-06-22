import React, { useRef, useState, useContext } from 'react';

import { Button, Calendar, ListBox, OverlayPanel, type ButtonProps } from '../prime';
import Text from '../Text';
import Context from '../Text/context';
import type { FormatOptions } from '../Gate/Gate.types';

export interface Props extends Omit<ButtonProps, 'value' | 'onChange'> {
    value: string;
    exclusive?: boolean;
    timeOnly?: boolean;
    inline?: boolean;
    onChange?: (event: {value: [Date, Date]}) => void;
    formatOptions?: FormatOptions;
}

const intervals = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000
};

const defaultTooltip: Props['tooltipOptions'] = {
    className: 'text-center',
    event: 'both',
    position: 'top'
};

const optionItems = ({display}) => <Text>{display}</Text>;

const options = [
    {from: 'now-30m', display: 'Last 30 minutes'},
    {from: 'now-1h', display: 'Last hour'},
    {from: 'now-12h', display: 'Last 12 hours'},
    {from: 'now-24h', display: 'Last 24 hours'},
    {from: 'now-1d', display: 'Today'},
    {from: 'now-2d', display: 'Since yesterday'},
    {from: 'now-7d', display: 'Last 7 days'},
    {from: 'now-1M', display: 'Last month'},
    {from: 'now-3M', display: 'Last 3 months'},
    {from: 'now-6M', display: 'Last 6 months'},
    {from: 'now-1y', display: 'Last 12 months'},
    {from: 'now-2y', display: 'Last 2 years'},
    {from: 'now-5y', display: 'Last 5 years'}
];

const relativeRE = /^now-(\d+)(m|h|d|M|y)$/;

function range(value) {
    return (typeof value === 'string' && value.startsWith('[')) ? JSON.parse(value).map(v => typeof v === 'string' ? new Date(v) : v) : [];
}

const DateRange = React.forwardRef<object, Props>(function DateRange({
    value,
    exclusive,
    tooltipOptions = defaultTooltip,
    timeOnly,
    inline,
    onChange,
    formatOptions,
    ...props
}, ref) {
    if (typeof ref === 'function') ref({});
    const [startValue, endValue] = range(value);
    const startValueTime = startValue?.getTime();
    const endValueTime = endValue?.getTime();
    const panel = useRef<OverlayPanel>();
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [option, setOption] = useState<{from: string, display?: string}>();
    const [dateFrom, setDateFrom] = useState(startValue);
    const [dateTo, setDateTo] = useState(endValue);
    const [[displayText, displayFrom, displayTo], setDisplay] = useState(['', null, null]);
    const ctx = useContext(Context);

    const displayDate = (value: Date) => (timeOnly ? value && ctx.formatValue(value, { type: 'time', ...formatOptions?.time }) : value && ctx.formatValue(value, { type: 'dateTime', ...formatOptions?.dateTime })) ?? '---';

    const display =
        (inline && `${displayDate(startValue)}\n÷\n${displayDate(endValue)}`) ||
        (!startValue && !endValue && 'Select period') ||
        (displayFrom && displayFrom?.getTime() === startValueTime && displayTo && displayTo?.getTime() === endValueTime && displayText) ||
        'Custom period';

    const setRelative = React.useCallback(({from: relativeTimeValue, display: newDisplay}) => {
        const [, interval, unit] = relativeTimeValue.match(relativeRE);
        const newTo = timeOnly ? new Date(0) : new Date();
        const newFrom = timeOnly ? new Date(0) : new Date();
        if (['d', 'M', 'y'].includes(unit)) newFrom.setHours(0, 0, 0, 0);
        switch (unit) {
            case 's':
            case 'h':
            case 'm':
                newFrom.setTime(newFrom.getTime() - interval * intervals[unit]);
                break;
            case 'd':
                newFrom.setTime(newFrom.getTime() - (interval - 1) * intervals.d);
                break;
            case 'M':
                newFrom.setMonth(newFrom.getMonth() - interval);
                break;
            case 'y':
                newFrom.setFullYear(newFrom.getFullYear() - interval);
                break;
        }
        if (exclusive) newTo.setHours(23, 59, 59, 999); else newTo.setHours(24, 0, 0, 0);
        setDateFrom(newFrom);
        setDateTo(newTo);
        setDisplay([newDisplay, newFrom, newTo]);
        onChange({value: [newFrom, newTo]});
    }, [exclusive, onChange, timeOnly]);

    const applyTimeRange = event => {
        panel.current?.toggle(event);
        onChange?.({value: [dateFrom, dateTo]});
    };

    const handleOptionChange = React.useCallback(event => {
        if (event.value) {
            setOption(event.value);
            setRelative(event.value);
        }
        panel.current?.toggle(event);
    }, [setRelative]);

    React.useEffect(() => {
        if (typeof value === 'string' && !value.startsWith('[') && relativeRE.test(value)) {
            const option = options.find(item => item.display === value || item.from === value) || {from: value};
            setOption(option);
            setRelative(option);
        }
    }, [setRelative, value]);

    return <>
        <Button
            {...!inline && {
                tooltip: (startValue || endValue) ? `${displayDate(startValue)}\n÷\n${displayDate(endValue)}` : undefined,
                tooltipOptions
            }}
            {...props}
            onClick={React.useCallback(event => {
                panel.current?.toggle(event);
                setDateFrom(startValueTime && new Date(startValueTime));
                setDateTo(endValueTime && new Date(endValueTime));
                if (!(displayFrom && displayFrom.getTime() === startValueTime && displayTo && displayTo.getTime() === endValueTime)) setOption(null);
            }, [startValueTime, endValueTime, displayFrom, displayTo])}
        >
            {display}
        </Button>
        <OverlayPanel ref={panel} showCloseIcon>
            <div className='flex gap-3'>
                <div className='card'>
                    <div className="field">
                        <label htmlFor="fromDate"><Text>From</Text></label><br />
                        <Calendar
                            id="fromDate"
                            value={dateFrom}
                            onChange={event => {
                                if (timeOnly && event.value instanceof Date) event.value.setFullYear(1970, 0, 1);
                                setDateFrom(event.value as Date);
                            }}
                            onShow={() => setCalendarVisible(true)}
                            onHide={() => setCalendarVisible(false)}
                            timeOnly={timeOnly}
                            showIcon
                            showTime
                            showSeconds
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="toDate"><Text>To</Text></label><br />
                        <Calendar
                            id="toDate"
                            eod={exclusive}
                            value={dateTo}
                            minDate={dateFrom}
                            onChange={event => {
                                if (exclusive && event.value instanceof Date) event.value.setMilliseconds(999);
                                if (timeOnly && event.value instanceof Date) event.value.setFullYear(1970, 0, 1);
                                setDateTo(event.value as Date);
                            }}
                            onShow={() => setCalendarVisible(true)}
                            onHide={() => setCalendarVisible(false)}
                            timeOnly={timeOnly}
                            showIcon
                            showTime
                            showSeconds
                        />
                    </div>
                    <Button
                        type="button"
                        onClick={applyTimeRange}
                    >
                        Apply Time Range
                    </Button>
                </div>
                {(timeOnly) ? null : <div>
                    <ListBox
                        value={option}
                        options={options}
                        onChange={handleOptionChange}
                        itemTemplate={optionItems}
                        disabled={calendarVisible}
                        optionLabel='display'
                    />
                </div>}
            </div>
        </OverlayPanel>
    </>;
});

export default DateRange;
