import React from 'react';
import { useSelector } from 'react-redux';

import { OverlayPanel } from '../prime';

import { State } from '../Store/Store.types';

const selectHint = (state: State) => state.hint;

const Hint = props => {
    const overlay = React.useRef(null);
    const {event, content} = useSelector(selectHint);
    React.useEffect(() => event && overlay.current?.show(event), [event]);
    return <OverlayPanel ref={overlay} {...props}>{content}</OverlayPanel>;
};

export default Hint;
