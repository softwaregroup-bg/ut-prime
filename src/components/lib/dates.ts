export const dateIn = (d) => {
    const dd = new Date(d);
    const properDate = new Date(
        new Date(d).getTime() + new Date(d).getTimezoneOffset() * 60 * 1000
    );
    const timezoneDiff = properDate.getTimezoneOffset() - dd.getTimezoneOffset();
    if (!timezoneDiff) return properDate;
    return new Date(properDate.getTime() + timezoneDiff * 60 * 1000);
};

export const dateOut = (d) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
