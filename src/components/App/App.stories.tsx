import React from 'react';
import type { Meta } from '@storybook/react';

import page from './README.mdx';
import App from './index';
import state from '../test/state';

const meta: Meta = {
    title: 'App',
    component: App,
    parameters: {docs: {page}}
};
export default meta;

export const Basic: React.FC<object> = ({children}) => {
    history.replaceState({}, '', '#');
    return <App
        portalName='test app'
        state={state}
        theme={{
            ut: {
                classes: {}
            },
            palette: {
                type: 'dark-compact'
            }
        }}
    >
        {children}
    </App>;
};

export const Register: React.FC<object> = ({children}) => {
    history.replaceState({}, '', '#');
    return <App
        portalName='test app'
        state={{...state, login: null}}
        theme={{
            ut: {
                classes: {}
            },
            palette: {
                type: 'dark-compact'
            }
        }}
        registrationPage = 'user.self.add'
        middleware = {[
            _store => next => action => (action.type === 'portal.component.get')
                ? Promise.resolve(function Register() {
                    return <div className='p-component'>Registration page: {action.page}</div>;
                })
                : next(action)
        ]}
    >
        {children}
    </App>;
};
