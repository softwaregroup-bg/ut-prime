import { useContext } from 'react';
import interpolate from 'ut-function.interpolate';
import { localeOptions } from 'primereact/api';

import Context from '../Text/context';
import { Props } from '../Text/Text.types';

interface HookParams {
    prefix?: Props['prefix'],
    params?: Props['params'],
    lang?: Props['lang'],
    id?: Props['id'],
    text?: string | React.ReactNode
}

export default function useText({ id, lang, params, prefix, text: textInput }: HookParams) {
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
}
