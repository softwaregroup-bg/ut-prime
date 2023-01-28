import { format } from 'date-fns';

export const fnMap = {
    datefns: (value, {format: f}) => format(value, f),
    'intl.date': (value: Date, options) => new Intl.DateTimeFormat(navigator.language, options).format(value),
    'intl.number': (value: number, options) => new Intl.NumberFormat(navigator.language, options).format(value),
    localeTimeString: (value: Date, options) => value.toLocaleTimeString(navigator.language, options),
    localeString: (value: Date) => value.toLocaleString(),
    localeDateString: (value: Date) => value.toLocaleDateString()
};
