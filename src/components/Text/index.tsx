import React, { useContext } from 'react';
import interpolate from 'ut-function.interpolate';

import Context from './context';

import { ComponentProps } from './Text.types';

const Text: ComponentProps = ({ params, prefix, children }) => {
    const {translate, language} = useContext(Context);
    if (typeof children !== 'string') return <>{children}</>;
    let template = children;
    if (typeof translate === 'function') {
        const text = (prefix ? [prefix, children] : [children]).join('>');
        // Translate the template
        template = translate(text, language);
        if (template === text) {
            template = children;
        }
    }
    return <span>{interpolate(template, params)}</span>;
};

export default Text;
