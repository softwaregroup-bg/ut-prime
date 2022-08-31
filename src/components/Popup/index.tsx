import { Button, Dialog } from '../prime';
import React, { useEffect, useState } from 'react';

import Text from '../Text';
import { useStyles } from './Popup.types';

const Popup = ({ message, params = { maximizable: false, header: '', footer: false, buttons: [], texts: {regular: {}, dynamic: {}}, responseObjectValidationField: '' }}) => {
    const { maximizable, header, footer, buttons, texts, responseObjectValidationField } = params;
    const breakpoints = { '960px': '75vw', '640px': '95vw' };
    const width = { width: '30vw' };

    const [open, setOpen] = useState(false);

    const classes = useStyles();

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    useEffect(() => {
        if (message && Object.keys(message).length && message?.[responseObjectValidationField]) {
            handleOpen();
        }
    }, [message, responseObjectValidationField]);

    const content = () => {
        const { regular, dynamic } = texts;

        if (!regular && !dynamic) return;

        const dialogContent = [];

        if (regular) {
            dialogContent.push(regular.map(text => {
                return <div key={text} className={classes.popupTextMessageWrap}>
                    <Text>{text}</Text>
                </div>;
            }));
        }

        if (dynamic) {
            dialogContent.push(dynamic.map(text => {
                return <div key={text.start} className={classes.popupTextMessageWrap}>
                    <Text>{`${text.start} ${message?.[text.one]?.[text.two]}`}</Text>
                </div>;
            }));
        }
        return dialogContent;
    };

    return open ? (
        <Dialog
            visible={open}
            onHide={handleClose}
            breakpoints={breakpoints}
            style={width}
            maximizable={maximizable}
            header={header}
            footer={footer}
        >
            <div
                key={'popup'}
                className={classes.popupWrap}
            >
                {content()}
                < div className={classes.popupButtonsWrap} >
                    {buttons.map(button => {
                        const { closePopUp, label } = button;
                        return < div key={label} className={classes.popupButton} >
                            <Button label={label} onClick={() => setOpen(closePopUp)} />
                        </div>;
                    })}
                </div>
            </div>
        </Dialog >
    ) : null;
};

export default Popup;
