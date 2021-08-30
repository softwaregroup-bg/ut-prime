import type {Properties} from 'csstype'; // eslint-disable-line
import {Theme as T} from '@material-ui/core/styles';
export interface Theme extends T {
    ut: {
        classes: {
            headerLogo?: string,
            loginTop?: string,
            loginBottom?: string
        },
        portalName?: string,
    },
    name?: string
}
