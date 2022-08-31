import {createUseStyles} from 'react-jss';

export const useStyles = createUseStyles({
    popupWrap: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    popupTextMessageWrap: {
        display: 'block',
        width: '100%',
        margin: 10,
        textAlign: 'center'
    },
    popupButtonsWrap: {
        display: 'flex',
        alignItems: 'center'
    },
    popupButton: {
        display: 'block',
        margin: 10,
        textAlign: 'center'
    }
});
