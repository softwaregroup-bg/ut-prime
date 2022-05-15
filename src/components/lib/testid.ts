export default (id : string) => id && ({'data-testid': id.replace(/[/.]/g, match => match === '.' ? '-' : '_')});
