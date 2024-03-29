import React from 'react';
import Component from '../Component';
import { useTheme } from 'react-jss';

import type { Theme } from '../Theme';

function integer(value) {
    if (typeof value === 'string') {
        const number = Number(value);
        if (Number.isSafeInteger(number) && String(number) === value) return number;
    }
    return value;
}

const Page = ({match: {params: {path}}, location: {search}}) => {
    const {pathname, searchParams} = new URL('ut-portal:' + path + search);
    const [page, ...rest] = pathname.split('/');
    const {language} = useTheme<Theme>();
    return <Component
        page={page}
        params={{
            ...Object.fromEntries(searchParams.entries()),
            ...rest.length > 0 && {id: integer(rest.join('/'))}

        }}
        language={language}
    />;
};

export default Page;
