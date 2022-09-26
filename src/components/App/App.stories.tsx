import React from 'react';
import type { Meta, Story } from '@storybook/react';

import page from './README.mdx';
import App from './index';
import type {Props} from './App.types';
import state from '../test/state';

const meta: Meta = {
    title: 'App',
    component: App,
    parameters: {docs: {page}}
};
export default meta;

const Template: Story<Props & {dir?: 'rtl' | 'ltr', theme}> = ({dir: storyDir, theme = 'dark-compact', ...props}, {globals: {dir}}) => {
    history.replaceState({}, '', '#');
    return <App
        portalName='test app'
        state={state}
        theme={{
            ut: {
                classes: {}
            },
            dir: storyDir || dir,
            palette: {
                type: theme
            }
        }}
        {...props}
    />;
};

export const Basic = Template.bind({});
export const BasicRTL = Template.bind({});
BasicRTL.args = {
    dir: 'rtl'
};

export const Register = Template.bind({});
Register.args = {
    state: {...state, login: null},
    registrationPage: 'user.self.add',
    middleware: [
        _store => next => action => (action.type === 'portal.component.get')
            ? Promise.resolve(function Register() {
                return <div className='p-component'>Registration page: {action.page}</div>;
            })
            : next(action)
    ]
};

export const RegisterRTL = Template.bind({});
RegisterRTL.args = {
    ...Register.args,
    dir: 'rtl'
};
