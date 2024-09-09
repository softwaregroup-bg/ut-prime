export const dateIn = (d) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let addition = 0;
    const dd = new Date(d);
    if (
        tz === 'Asia/Baghdad' &&
        dd.getFullYear() === 1994 &&
        dd.getMonth() === 3 &&
        dd.getDate() === 1
    ) {
        // some glitch in the matrix between
        //
        // - AST(Arabia Standard Time)
        // - Arabia Daylight Time
        // as 01/04/1994 is in ADT
        // and 31/03/1994 is in AST
        //
        // I guess on 1st of April, 1994 Iraq shifted from AST to ADT...
        addition = 60;
    }
    return new Date(
        new Date(d).getTime() +
            (new Date(d).getTimezoneOffset() + addition) * 60 * 1000
    );
};

export const dateOut = (d) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
