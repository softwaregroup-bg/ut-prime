const startDate = new Date(2022, 5, 22);

if (!window?.navigator?.userAgent?.match?.(/Chromatic/)) {
    startDate.setTime(Date.now());
    startDate.setHours(-36, 0, 0, 0);
}

const filteredItems = (filterBy) => {
    return Object.entries(filterBy).reduce((items, [key, value]) => {
        return items.filter(i => {
            if (Array.isArray(value) && (value[0] instanceof Date || value[1] instanceof Date)) {
                return (value[0] == null || value[0] <= i[key]) && (value[1] == null || i[key] < value[1]);
            }
            return value == null || i[key] === value || (typeof value === 'string' && i[key].toString().toLowerCase().includes(value.toLowerCase()));
        });
    }, [...Array(55).keys()].map(number => ({
        id: number,
        name: `Item ${number}`,
        date: new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * number),
        dateTime: new Date(startDate.getTime() + 1000 * 60 * 60 * number),
        time: new Date(1000 * 60 * 10 * number),
        size: number * 10
    })));
};

const compare = ({field, dir, smaller = {ASC: -1, DESC: 1}[dir]}) => function compareMock(a, b) {
    if (a[field] < b[field]) return smaller;
    if (a[field] > b[field]) return -smaller;
    return 0;
};

export const fetchItems = async filters => {
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });
    const items = filteredItems(filters.items);
    if (Array.isArray(filters.orderBy) && filters.orderBy.length) items.sort(compare(filters.orderBy[0]));
    return Promise.resolve({
        items: items.slice((filters.paging.pageNumber - 1) * filters.paging.pageSize, filters.paging.pageNumber * filters.paging.pageSize),
        pagination: {
            recordsTotal: items.length
        }
    });
};

export const updateItems = update => {
    let size = 0;
    // eslint-disable-next-line no-process-env
    const interval = (process.env.NODE_ENV === 'production') ? 10000 : 1000;
    const handle = setInterval(() => {
        size++;
        update({0: {size}});
    }, interval);
    return () => clearInterval(handle);
};
