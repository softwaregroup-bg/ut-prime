import React, { useRef, useState } from 'react';

import { Button, Calendar, ListBox, OverlayPanel } from '../prime';
import Text from '../Text';

import { ComponentProps } from './DateRange.types';

const intervals = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000
};

const defaultTooltip: Parameters<ComponentProps>[0]['tooltipOptions'] = {
    className: 'text-center',
    event: 'both',
    position: 'top'
};

const optionItems = ({display}) => <Text>{display}</Text>;

const options = [
    {from: 'now-30m', display: 'Last 30 minutes'},
    {from: 'now-1h', display: 'Last 1 hour'},
    {from: 'now-12h', display: 'Last 12 hours'},
    {from: 'now-24h', display: 'Last 24 hours'},
    {from: 'now-1d', display: 'Today'},
    {from: 'now-2d', display: 'Since yesterday'},
    {from: 'now-7d', display: 'Last 7 days'},
    {from: 'now-1M', display: 'Last 1 month'},
    {from: 'now-3M', display: 'Last 3 months'},
    {from: 'now-6M', display: 'Last 6 months'},
    {from: 'now-1y', display: 'Last 1 year'},
    {from: 'now-2y', display: 'Last 2 years'},
    {from: 'now-5y', display: 'Last 5 years'}
];

const DatePicker: ComponentProps = ({
    value,
    exclusive,
    tooltipOptions = defaultTooltip,
    timeOnly,
    inline,
    onChange,
    ...props
}) => {
    const panel = useRef<OverlayPanel>();
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [option, setOption] = useState();
    const [dateFrom, setDateFrom] = useState(value?.[0]);
    const [dateTo, setDateTo] = useState(value?.[1]);
    const [[displayText, displayFrom, displayTo], setDisplay] = useState(['', null, null]);

    const displayDate = (value: Date) => (timeOnly ? value?.toLocaleTimeString() : value?.toLocaleString()) ?? '---';

    const display =
        (inline && `${displayDate(value?.[0])}\n÷\n${displayDate(value?.[1])}`) ||
        (!value?.[0] && !value?.[1] && 'Select period') ||
        (displayFrom && displayFrom === value?.[0] && displayTo && displayTo === value?.[1] && displayText) ||
        'Custom period';

    const setRelative = ({from: relativeTimeValue, display: newDisplay}) => {
        const [, interval, unit] = relativeTimeValue.match(/-(\d+)(m|h|d|M|y)$/);
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
        if (['d', 'M', 'y'].includes(unit)) {
            if (exclusive) newTo.setHours(23, 59, 59, 999); else newTo.setHours(24, 0, 0, 0);
        }
        setDateFrom(newFrom);
        setDateTo(newTo);
        setDisplay([newDisplay, newFrom, newTo]);
        onChange({value: [newFrom, newTo]});
    };

    const applyTimeRange = event => {
        panel.current?.toggle(event);
        onChange?.({value: [dateFrom, dateTo]});
    };

    const handleOptionChange = event => {
        if (event.value) {
            setOption(event.value);
            setRelative(event.value);
        }
        panel.current?.toggle(event);
    };

    return <>
        <Button
            {...!inline && {
                tooltip: (value?.[0] || value?.[1]) ? `${displayDate(value?.[0])}\n÷\n${displayDate(value?.[1])}` : undefined,
                tooltipOptions
            }}
            label={display}
            {...props}
            onClick={React.useCallback(event => {
                panel.current?.toggle(event);
                setDateFrom(value?.[0]);
                setDateTo(value?.[1]);
                if (!(displayFrom && displayFrom === value?.[0] && displayTo && displayTo === value?.[1])) setOption(null);
            }, [value, displayFrom, displayTo])}
        />
        <OverlayPanel ref={panel} showCloseIcon>
            <div className='flex gap-3'>
                <div className='card'>
                    <div className="field">
                        <label htmlFor="fromDate">From</label><br />
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
                        <label htmlFor="toDate">To</label><br />
                        <Calendar
                            id="toDate"
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
                        label={'Apply Time Range'}
                        onClick={applyTimeRange}
                    />
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
};

export default DatePicker;
