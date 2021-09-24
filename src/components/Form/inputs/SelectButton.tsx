import { styled } from '../../mui/styles';
import { SelectButton } from '../../prime';

export default styled(SelectButton)(() => ({
    height: '100%',
    '& .p-component.p-button': {
        height: '100%'
    },
    '& .p-component.p-button.p-highlight': {
        backgroundColor: 'var(--primary-color)',
        color: 'var(--primary-color-text)'
    },
    '& .p-component.p-button:not(.p-disabled):not(.p-highlight):hover': {
        backgroundColor: 'var(--primary-color)',
        color: 'var(--primary-color-text)'
    },
    '& .p-component.p-button:focus.p-highlight': {
        backgroundColor: 'var(--primary-color)',
        color: 'var(--primary-color-text)'
    }
}));
