import {createUseStyles} from 'react-jss';

export const useStyles = createUseStyles({
    primary: {
        color: 'var(--primary-color)'
    },
    blurred: {},
    unchanged: {},
    changed: {},
    deleted: {},
    added: {},
    newLine: {},
    lineContainer: {},
    lineColumn: {},
    lineSplitter: {},
    valueContainer: {},
    newLineContainer: {},
    leftWrap: {},
    rightWrap: {},
    changedValue: {},
    inlineWrap: {},
    spaces: {
        whiteSpace: 'pre-wrap',
        display: 'inline-block'
    }
});
