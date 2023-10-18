import React from 'react';
import Component from '../Component';
import { useTheme } from 'react-jss';

import type { Theme } from '../Theme';

const Page = ({match: {params: {path}}, location: {search}}) => {
    const {pathname, searchParams} = new URL('ut-portal:' + path + search);
    const [page, ...rest] = pathname.split('/');
    const {language} = useTheme<Theme>();
    return <Component
        page={page}
        params={{
            ...Object.fromEntries(searchParams.entries()),
            ...rest.length > 0 && {id: rest.join('/')}

        }}
        language={language}
    />;
};

export default Page;
