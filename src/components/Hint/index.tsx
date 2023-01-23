import React from 'react';
import { useSelector } from 'react-redux';

import { OverlayPanel } from '../prime';
import Text from '../Text';

import { State } from '../Store/Store.types';

const selectHint = (state: State) => state.hint;

const Hint = props => {
    const overlay = React.useRef(null);
    const {event, result, error} = useSelector(selectHint);
    React.useEffect(() => event && overlay.current?.show(event), [event]);
    return <OverlayPanel ref={overlay} className={error ? 'text-red-500 ' : 'text-green-500'} {...props}><Text params={error?.params}>{error ? error.print || error.message : result}</Text></OverlayPanel>;
};

export default Hint;
