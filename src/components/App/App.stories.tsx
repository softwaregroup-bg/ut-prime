import React from 'react';
import type { Meta, Story } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import merge from 'ut-function.merge';

import page from './README.mdx';
import App from './index';
import Text from '../Text';
import type {Props} from './App.types';
import state from '../test/state';
import {middleware} from '../Text/Text.mock';

function ExtraTitleComponent() {
    return <div className='p-component'>
        <div><Text>Line 1</Text></div>
        <div><Text>Line 2</Text></div>
    </div>;
}

function RegisterComponent(action) {
    return function RegisterComponent({language}) {
        return <div className='p-component'>
            <div><Text lang={language}>Component page</Text>: {action.page}</div>
            <div><Text lang={language}>Parameters</Text>: {JSON.stringify(action.params)}</div>
            <div><Text lang={language}>Language</Text>: {language}</div>
        </div>;
    };
}

const componentMiddleware = _store => next => action => (action.type === 'portal.component.get')
    ? Promise.resolve(action.page === 'some.provided.component' ? ExtraTitleComponent : RegisterComponent(action))
    : next(action);

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
                classes: {}
            },
            dir: storyDir || dir,
            language,
            languages: {
                ar: {
                    passwordPrompt: 'أدخل كلمة المرور',
                    Login: 'تسجيل الدخول',
                    'Login with password': 'تسجيل الدخول بكلمة مرور',
                    Register: 'يسجل',
                    'Component page': 'صفحة',
                    Language: 'لغة',
                    Parameters: 'حدود',
                    Username: 'اسم المستخدم',
                    Password: 'كلمة المرور',
                    'Line 1': 'خط 1',
                    'Line 2': 'خط 2'
                },
                bg: {
                    passwordPrompt: 'Въведете парола',
                    Login: 'Вход',
                    'Login with password': 'Вход с парола',
                    Register: 'Регистрация',
                    'Component page': 'Страница',
                    Language: 'Език',
                    Parameters: 'Параметри',
                    Username: 'Потребител',
                    Password: 'Парола',
                    'Line 1': 'Линия 1',
                    'Line 2': 'Линия 2'
                }
            },
            palette: {
                type: theme
            }
        }}
        middleware={[middleware, componentMiddleware]}
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

export const BasicWithExtraTitleComponentBG = Template.bind({});
BasicWithExtraTitleComponentBG.args = {
    extraTitleComponent: 'some.provided.component',
    lang: 'bg'
};

export const BasicWithExtraTitleComponentAR = Template.bind({});
BasicWithExtraTitleComponentAR.args = {
    extraTitleComponent: 'some.provided.component',
    lang: 'ar',
    dir: 'rtl'
};

export const Register = Template.bind({});
Register.args = {
    state: {...state, login: null},
    registrationPage: 'user.self.add'
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

export const RegisterWithTitle = Template.bind({});
RegisterWithTitle.args = {
    ...Register.args,
    loginTitleComponent: 'some.provided.component'
};

export const RegisterWithTitleBG = Template.bind({});
RegisterWithTitleBG.args = {
    ...RegisterWithTitle.args,
    lang: 'bg'
};

export const RegisterWithTitleAR = Template.bind({});
RegisterWithTitleAR.args = {
    ...RegisterWithTitle.args,
    lang: 'ar',
    dir: 'rtl'
};

export const Home = Template.bind({});
Home.args = {
    state: {...state, login: null},
    homePage: 'some.home.page'
};

export const Page = Template.bind({});
Page.args = {};
Page.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    userEvent.click(await canvas.findByTestId('portal-menu_page4'));
};

export const PageBG = Template.bind({});
PageBG.args = {
    lang: 'bg'
};
PageBG.play = Page.play;

export const PageAR = Template.bind({});
PageAR.args = {
    dir: 'rtl',
    lang: 'ar'
};
PageAR.play = Page.play;
