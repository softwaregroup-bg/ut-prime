import React from 'react';
import { ComponentProps } from './Text.types';

import { useText } from '../hooks';

const Text: ComponentProps = ({ id, lang, params, prefix, children }) => {
    const text = useText({id, lang, params, prefix, text: children});
    if (typeof children !== 'string') return <>{children}</>;
    return text;
};

export default Text;
