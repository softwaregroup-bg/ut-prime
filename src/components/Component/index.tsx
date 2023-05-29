import React from 'react';
import { useDispatch } from 'react-redux';
import template from 'ut-function.template';

import { ProgressSpinner } from 'primereact/progressspinner';

const center : React.HTMLAttributes<Element>['style'] = {
    transform: 'translate(-50%, -50%)'
};

const Page: React.FC<{
    page: string,
    params?: unknown,
    language?: string,
    getValues?: () => unknown,
    [props: string]: unknown}
> = ({page, params, getValues, children, ...props}) => {
    const [Page, setPage] = React.useState<React.FC>();
    const dispatch: (action: {type: string, page: string, params: unknown}) => Promise<React.FC> = useDispatch();
    React.useEffect(() => {
        const action = {type: 'portal.component.get', page, params };
        if (getValues) {
            const form = getValues();
            action.page = template(page, form);
            action.params = JSON.parse(template(typeof params === 'string' ? params : JSON.stringify(params ?? {}), form, {}, 'json'));
        }
        action.page && dispatch(action).then(component => setPage(() => component));
    }, [page, dispatch, params, getValues, props.parent]);
    return Page ? <Page {...{getValues, ...props}} >{children}</Page> : <div className='absolute top-50 left-50' style={center}><ProgressSpinner /></div>;
};

export default Page;
