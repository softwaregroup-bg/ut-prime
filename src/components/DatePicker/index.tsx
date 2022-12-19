import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { ListBox } from 'primereact/listbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useRef, useState } from 'react';
import {createUseStyles} from 'react-jss';
import { ComponentProps } from 'ut-prime/src/components/DatePicker/DatePicker.types';

const useStyles = createUseStyles({
    datePicker: {
        '& .overlaypanel': {
            display: 'flex',
            gap: '20px'
        },
        '& .card': {
            background: 'red'
        }
    }
});

const DatePicker: ComponentProps = ({
    className,
    ...props
}) => {
    const classes = useStyles();
    const op = useRef<OverlayPanel>(null);
    const [selectedTimeRange, setselectedTimeRange] = useState<Date | Date[] | undefined>(undefined);
    const [dateFrom, setDateFrom] = useState<Date | Date[] | undefined>(undefined);
    const [dateTo, setDateTo] = useState<Date | Date[] | undefined>(undefined);
    const calculateRelativeTimeRange = (relativeTimeValue) => {
        const fromKey = relativeTimeValue.split('-')[1].slice(-1);
        const now = Date.now();
        const interval = now - Number(relativeTimeValue.split('-')[1].split('').slice(0, -1).join('')) * intervalsInMiliseconds[fromKey];
        setDateFrom(new Date(now));
        setDateTo(new Date(interval));
    };
    const intervalsInMiliseconds = {
        y: 31536000000,
        M: 2592000000,
        w: 604800000,
        d: 86400000,
        h: 3600000,
        m: 60000,
        s: 1000
    };
    const availableTimeRanges = [
        {
            from: 'now-5m',
            to: new Date(),
            display: 'Last 5 minutes'
        },
        {
            from: 'now-15m',
            to: new Date(),
            display: 'Last 15 minutes'
        },
        {
            from: 'now-30m',
            to: new Date(),
            display: 'Last 30 minutes'
        },
        {
            from: 'now-1h',
            to: new Date(),
            display: 'Last 1 hour'
        },
        {
            from: 'now-3h',
            to: new Date(),
            display: 'Last 3 hours'
        },
        {
            from: 'now-6h',
            to: new Date(),
            display: 'Last 6 hours'
        },
        {
            from: 'now-12h',
            to: new Date(),
            display: 'Last 12 hours'
        },
        {
            from: 'now-24h',
            to: new Date(),
            display: 'Last 24 hours'
        },
        {
            from: 'now-2d',
            to: new Date(),
            display: 'Last 2 days'
        },
        {
            from: 'now-7d',
            to: new Date(),
            display: 'Last 7 days'
        },
        {
            from: 'now-30d',
            to: new Date(),
            display: 'Last 30 days'
        },
        {
            from: 'now-90d',
            to: new Date(),
            display: 'Last 90 days'
        },
        {
            from: 'now-6M',
            to: new Date(),
            display: 'Last 6 months'
        },
        {
            from: 'now-1y',
            to: new Date(),
            display: 'Last 1 year'
        },
        {
            from: 'now-2y',
            to: new Date(),
            display: 'Last 2 years'
        },
        {
            from: 'now-5y',
            to: new Date(),
            display: 'Last 5 years'
        }
    ];
    const [recentlyUsed, setRecentlyUsed] = useState([]);

    const applyTimeRange = () => {
        setRecentlyUsed(state => [...state, `${dateFrom.toLocaleString()} - ${dateTo.toLocaleString()}`].slice(length - 4));
    };

    const optionItems = (option) => {
        return (
            <div className="optionItem">
                <div>{option.display}</div>
            </div>
        );
    };

    const onChangeListBoxHandler = (e) => {
        setselectedTimeRange(e.value);
        calculateRelativeTimeRange(e.value.from);
    };

    return <div className={clsx(className, classes.datePicker)}>
        <Button
            type="button"
            // icon="pi"
            label={'Date'}
            onClick={(e) => op.current?.toggle(e)}
            aria-haspopup
            aria-controls="overlay_panel"
            className="select-button"
        />
        <OverlayPanel
            ref={op}
            showCloseIcon
            id="overlay_panel"
            style={{
                width: '550px'
            }}
            className="overlaypanel"
        >
            <div style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'space-between'
            }}
            >
                <div className="card">
                    <div className="field">
                        <label htmlFor="fromDate">From</label><br />
                        <Calendar key='1' id="fromDate" value={dateFrom} placeholder={dateFrom?.toLocaleString()} onChange={(e) => setDateFrom(e.value)} showIcon showTime/>
                    </div>
                    <div className="field">
                        <label htmlFor="toDate">To</label><br />
                        <Calendar key='2' id="toDate" value={dateTo} placeholder={dateTo?.toLocaleString()} minDate={new Date(dateFrom?.toLocaleString())} readOnlyInput onChange={(e) => setDateTo(e.value)} showIcon showTime/>
                    </div>
                    <Button
                        type="button"
                        label={'Apply Time Range'}
                        onClick={applyTimeRange}
                        aria-haspopup
                        aria-controls="overlay_panel"
                        className="button"
                    />
                    <p><strong>Recently used absolute ranges</strong></p>
                    {recentlyUsed.map((e, i) => (<p key={i}>{e}</p>))}
                </div>
                <div className='card'>
                    <ListBox value={selectedTimeRange} options={availableTimeRanges} onChange={e => onChangeListBoxHandler(e)} filter optionLabel="display"
                        itemTemplate={optionItems} listStyle={{ maxHeight: '300px' }}
                    />
                </div>
            </div>
        </OverlayPanel>
    </div>;
};

export default DatePicker;
