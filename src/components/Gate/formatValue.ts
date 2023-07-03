import { format } from 'date-fns';
import merge from 'ut-function.merge';

const defaultFormatOptions = {
    time: { fn: 'localeTimeString', timeStyle: 'short', hourCycle: 'h23' },
    dateTime: { fn: 'localeString' },
    date: { fn: 'localeDateString' },
    currency: {fn: 'intl.number', minimumFractionDigits: 2, maximumFractionDigits: 4}
};

export default function fnMap({languageCode, ...formatOptions}) {
    const base = {
        datefns: baseOptions => (value, options) => {
            const { format: formatString = 'yyyy-MM-dd HH:mm:ss', ...opts} = {...baseOptions, ...options};
            return format(value, formatString, opts);
        },
        'intl.date': format => {
            const dateFormat = new Intl.DateTimeFormat(languageCode, format);
            return (value: Date) => dateFormat.format(value);
        },
        'intl.number': format => {
            const numberFormat = new Intl.NumberFormat(languageCode, format);
            return (value: number) => numberFormat.format(value);
        },
        localeTimeString: (baseOptions: Intl.DateTimeFormatOptions) => (value: Date, options: Intl.DateTimeFormatOptions) => value.toLocaleTimeString(languageCode, {...baseOptions, ...options}),
        localeString: (baseOptions: Intl.DateTimeFormatOptions) => (value: Date, options: Intl.DateTimeFormatOptions) => value.toLocaleString(languageCode, {...baseOptions, ...options}),
        localeDateString: (baseOptions: Intl.DateTimeFormatOptions) => (value: Date, options: Intl.DateTimeFormatOptions) => value.toLocaleDateString(languageCode, {...baseOptions, ...options})
    };
    const types = Object.fromEntries(Object.entries(merge({}, defaultFormatOptions, formatOptions)).map(([name, {fn, ...options}]: [string, {fn: string}]) =>
        [name, base[fn](options)]
    ));
    return (value, {type, fn, ...format}) => {
        if (value == null) return value;
        return fn ? base[fn](format)(value, format) : types[type](value, format);
    };
}
