const filteredItems = (filterBy) => {
    return Object.entries(filterBy).reduce((items, [key, value]) => {
        return items.filter(i => {
            return value === undefined || i[key] === value || (typeof value === 'string' && i[key].toString().toLowerCase().includes(value.toLowerCase()));
        });
    }, [...Array(55).keys()].map(number => ({
        id: number,
        name: `Item ${number}`,
        size: number * 10
    })));
};

const compare = ({field, dir, smaller = {ASC: -1, DESC: 1}[dir]}) => function compare(a, b) {
    if (a[field] < b[field]) return smaller;
    if (a[field] > b[field]) return -smaller;
    return 0;
};

export const fetchItems = filters => {
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
    const handle = setInterval(() => {
        size++;
        update({0: {size}});
    }, 1000);
    return () => clearInterval(handle);
};
