import React, { useContext } from 'react';
import interpolate from 'ut-function.interpolate';
import { localeOptions } from 'primereact/api';

import Context from './context';

import { ComponentProps, HookParams } from './Text.types';

export const useText = ({ id, lang, params, prefix, text: textInput }: HookParams) => {
    const {translate, language} = useContext(Context);
    if (typeof textInput !== 'string') return;
    let template = textInput;
    if (typeof translate === 'function') {
        const text = (prefix ? [prefix, textInput] : [textInput]).join('>');
        // Translate the template
        template = translate(id, text, lang || language);
        if (template === text) {
            template = textInput;
        }
    } else {
        template = localeOptions(lang || language)?.[template] || template;
    }
    return interpolate(template, params);
};

const Text: ComponentProps = ({ id, lang, params, prefix, children }) => {
    const text = useText({id, lang, params, prefix, text: children});
    if (typeof children !== 'string') return <>{children}</>;
    return text;
};

export default Text;
