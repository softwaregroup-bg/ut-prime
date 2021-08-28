import { styled } from '../../mui/styles';
import { MultiSelect } from '../../prime';

class MultiSelectPanel extends MultiSelect {
    componentDidMount() {
        super.componentDidMount();
        this.setState({overlayVisible: true});
        // @ts-ignore Property 'alignOverlay' does not exist on type 'MultiSelect'
        super.alignOverlay();
    }

    onOptionKeyDown(event) {
        const originalEvent = event.originalEvent;
        if (originalEvent.which === 27) return;
        // @ts-ignore Property 'onOptionKeyDown' does not exist on type 'MultiSelect'
        return super.onOptionKeyDown(event);
    }
};

export default styled(MultiSelectPanel)(({columns = 4}: {columns?: number}) => ({
    '& .p-multiselect-close': {
        display: 'none'
    },
    '& .p-multiselect-trigger': {
        display: 'none'
    },
    '& .p-multiselect-panel': {
        background: 'none',
        position: 'initial',
        boxShadow: 'none',
        '& .p-multiselect-header': {
            background: 'none'
        }
    },
    '& .p-multiselect-items': {
        display: 'flex',
        flexWrap: 'wrap',
        '& .p-multiselect-item': {
            width: `${100 / columns}%`
        }
    }
}));
