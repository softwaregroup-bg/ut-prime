import React from 'react';
import { Dialog, Button, ListBox } from '../prime';
import type {Cards} from '../types';

interface SelectProps {
    visible: boolean;
    onSelect: (items: string) => void;
    onHide: () => void;
    cards: Cards
}

export default function Select({visible, onHide, onSelect, cards}: SelectProps) {
    const [value, setValue] = React.useState(null);
    const options = React.useMemo(() => Object.entries(cards).map(([name, card]: [string, {label: string}]) => ({value: name, label: card.label || name})), [cards]);
    const close = React.useCallback(() => {
        setValue(null);
        onHide();
    }, [onHide]);
    return <Dialog
        visible={visible}
        onHide={close}
        header='Select card to add'
        modal
    >
        <ListBox
            options={options}
            value={value}
            onChange={e => setValue(e.value)}
        />
        <Button label="Add" icon="pi pi-check" autoFocus onClick={() => {
            onSelect(value);
            close();
        }}
        />
        <Button label="Cancel" icon="pi pi-times" onClick={close} className="p-button-text" />
    </Dialog>;
}
