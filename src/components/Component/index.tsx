import React from 'react';
import { useDispatch } from 'react-redux';
import {ProgressSpinner} from '../prime';

const center : React.HTMLAttributes<Element>['style'] = {
    transform: 'translate(-50%, -50%)'
};

const Page: React.FC<{page: string, params?: unknown, language?: string, [props: string]: unknown}> = ({page, params, children, ...props}) => {
    const [Page, setPage] = React.useState<React.FC>();
    const dispatch: (action: {type: string, page: string, params: unknown}) => Promise<React.FC> = useDispatch();
    React.useEffect(() => {
        page && dispatch({type: 'portal.component.get', page, params}).then(component => setPage(() => component));
    }, [page, dispatch, params]);
    return Page ? <Page {...props} >{children}</Page> : <div className='absolute top-50 left-50' style={center}><ProgressSpinner /></div>;
};

export default Page;
