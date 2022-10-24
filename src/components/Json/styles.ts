import {createUseStyles} from 'react-jss';

export const useStyles = createUseStyles({
    leftWrap: {
        position: 'relative',
        width: '50%',
        background: '#fff',
        overflow: 'hidden'
    },
    rightWrap: {
        position: 'relative',
        width: '50%',
        background: '#fff',
        overflow: 'hidden'
    },
    inlineWrap: {
        position: 'relative',
        width: [['calc(100% - 20px)'], '!important'],
        background: '#fff',
        overflow: 'hidden'
    },
    lineContainer: {
        width: 55,
        lineHeight: '28px',
        background: '#D9D9D9'
    },
    lineColumn: {
        display: 'inline-block',
        width: 55,
        paddingRight: 5,
        textAlign: 'right'
    },
    lineSplitter: {
        lineHeight: '28px'
    },
    '.inlineWrap .valueContainer': {
        width: 'calc(100% - 135px)'
    },
    valueContainer: {
        lineHeight: '28px',
        width: 'calc(100% - 75px)',
        margin: '0 10px',
        padding: '0 10px',
        wordWrap: 'break-word'
    },
    '.lineSplitter, .added .lineSplitter, .changed .lineSplitter, .deleted .lineSplitter': {
        width: 5,
        background: [['#fff'], '!important']
    },
    newLine: {
        display: 'flex',
        minHeight: 28,
        height: '100%'
    },
    newLineContainer: {
        display: 'flex',
        minHeight: 28
    },
    value: {
        display: 'inline',
        overflow: 'hidden',
        wordWrap: 'break-word',
        lineHeight: '28px',
        padding: '0 5px'
    },
    contents: {
        display: 'inline',
        overflow: 'hidden',
        wordWrap: 'break-word'
    },
    changed: {
        background: '#e5e5e5'
    },
    added: {
        background: '#d1f4d0'
    },
    deleted: {
        background: '#fcdddd'
    },
    '.leftWrap .changed .valueContainer, .inlineWrap .changed .valueContainer, .rightWrap .changed .valueContainer': {
        background: '#e5e5e5'
    },
    '.leftWrap .added .valueContainer, .inlineWrap .added .valueContainer': {
        background: '#d1f4d0'
    },
    '.rightWrap .deleted .valueContainer, .inlineWrap .deleted .valueContainer': {
        background: '#fcdddd'
    },
    '.rightWrap .changed .value > .contents, .changedValue > .contents': {
        textDecoration: 'line-through'
    },
    unchanged: {
        // display: [['none'], '!important']
    },
    hideUnchanged: {
        display: [['none'], '!important']
    },
    '.hideChanges .changed .valueContainer, .hideChanges .changed .valueContainer,\n.hideDeletions .deleted .valueContainer, .hideAdditions .added .valueContainer': {
        backgroundColor: [['initial'], '!important']
    },
    changedValue: {
        paddingLeft: 20
    },
    objKey: {
        color: '#699CFC'
    },
    objValue: {
        display: 'inherit'
    },
    objTitle: {
        fontWeight: 'bold',
        fontSize: 16
    },
    arrayLabel: {
        color: '#666666'
    },
    spaces: {
        whiteSpace: 'pre-wrap',
        textDecoration: [['none'], '!important'],
        display: 'inline-block'
    },
    activeLink: {
        color: 'var(--ut-history-standardActiveLinkTextColor)',
        textDecoration: 'none',
        cursor: 'pointer'
    },
    '.activeLink:hover': {
        textDecoration: 'underline',
        cursor: 'pointer'
    }
});
