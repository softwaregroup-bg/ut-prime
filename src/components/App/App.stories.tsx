import React from 'react';
import type { Meta, Story } from '@storybook/react';
import merge from 'ut-function.merge';

import page from './README.mdx';
import App from './index';
import Text from '../Text';
import type {Props} from './App.types';
import state from '../test/state';
import {middleware} from '../Text/Text.mock';

const meta: Meta = {
    title: 'App',
    component: App,
    parameters: {docs: {page}}
};
export default meta;

const Template: Story<Props & {dir?: 'rtl' | 'ltr', theme}> = ({dir: storyDir, theme = 'dark-compact', lang: language, ...props}, {globals: {dir} = {}}) => {
    history.replaceState({}, '', '#');
    return <App
        portalName='test app'
        state={merge({}, state, {login: {language: {languageId: language}}})}
        theme={{
            ut: {
                classes: {},
                extraTitle: 'secondary title'
            },
            dir: storyDir || dir,
            language,
            languages: {
                ar: {
                    passwordPrompt: 'أدخل كلمة المرور',
                    Login: 'تسجيل الدخول',
                    'Login with password': 'تسجيل الدخول بكلمة مرور',
                    Register: 'يسجل',
                    'Registration page': 'صفحة التسجيل',
                    Username: 'اسم المستخدم',
                    Password: 'كلمة المرور'
                },
                bg: {
                    passwordPrompt: 'Въведете парола',
                    Login: 'Вход',
                    'Login with password': 'Вход с парола',
                    Register: 'Регистрация',
                    'Registration page': 'Страница за регистрация',
                    Username: 'Потребител',
                    Password: 'Парола'
                }
            },
            palette: {
                type: theme
            }
        }}
        middleware={[middleware]}
        {...props}
    />;
};

export const Basic = Template.bind({});
export const BasicBG = Template.bind({});
BasicBG.args = {
    lang: 'bg'
};
export const BasicAR = Template.bind({});
BasicAR.args = {
    dir: 'rtl',
    lang: 'ar'
};

export const Register = Template.bind({});
Register.args = {
    state: {...state, login: null},
    registrationPage: 'user.self.add',
    middleware: [
        _store => next => action => (action.type === 'portal.component.get')
            ? Promise.resolve(function Register({language}) {
                return <div className='p-component'><Text lang={language}>Registration page</Text>: {action.page}</div>;
            })
            : next(action)
    ]
};

export const RegisterBG = Template.bind({});
RegisterBG.args = {
    ...Register.args,
    lang: 'bg'
};

export const RegisterAR = Template.bind({});
RegisterAR.args = {
    ...Register.args,
    lang: 'ar',
    dir: 'rtl'
};
