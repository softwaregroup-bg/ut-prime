import React, { useContext } from 'react';
import interpolate from 'ut-function.interpolate';
import { localeOptions } from 'primereact/api';

import Context from './context';

import { ComponentProps } from './Text.types';

const Text: ComponentProps = ({ id, lang, params, prefix, children }) => {
    const {translate, language} = useContext(Context);
    if (typeof children !== 'string') return <>{children}</>;
    let template = children;
    if (typeof translate === 'function') {
        const text = (prefix ? [prefix, children] : [children]).join('>');
        // Translate the template
        template = translate(id, text, lang || language);
        if (template === text) {
            template = children;
        }
    } else {
        template = localeOptions(lang || language)?.[template] || template;
    }
    return interpolate(template, params);
};

export default Text;
