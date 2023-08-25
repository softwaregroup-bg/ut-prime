import React from 'react';
import type { Meta, Story } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import merge from 'ut-function.merge';
import { Link, useLocation } from 'react-router-dom';

import page from './README.mdx';
import App from './index';
import Text from '../Text';
import type {Props} from './App.types';
import state from '../test/state';
import {middleware} from '../Text/Text.mock';

function ExtraTitleComponent() {
    return <div>
        <div><Text>Line 1</Text></div>
        <div><Text>Line 2</Text></div>
    </div>;
}

function RegisterComponent(action) {
    return function RegisterComponent({language}) {
        return <div className='p-component'><Text lang={language}>Registration page</Text>: {action.page}</div>;
    };
}

const componentMiddleware = _store => next => action => (action.type === 'portal.component.get')
    ? Promise.resolve(action.page === 'some.provided.component' ? ExtraTitleComponent : RegisterComponent(action))
    : next(action);

const route = _store => next => action => {
    if (action.type !== 'portal.route.find') return next(action);
    const {pathname: path, searchParams} = new URL('ut-portal:' + action.path);
    if (typeof path !== 'string' || !path.includes('/')) return next(action);
    const [, method, ...rest] = path.split('/');
    if (!method && !action?.route?.path) return next(action);
    next({
        type: action?.route?.component ? 'front.page.show' : 'front.tab.show',
        tab: () => ({
            title: action?.route?.component,
            component: (params) => {
                if (action?.route?.component === 'some.home.page') {
                    return function HomePage(props) {
                        const location = useLocation();
                        return <div>
                            <div><Text>Home Page</Text></div>
                            {params.id && <div><Text>Id: {params.id}</Text></div>}
                            <Link data-testid='public' className="mr-2" to={'/public'}>Public</Link>
                            <Link data-testid='next' to={'/public/1'}>Public 1</Link>
                            <div>
                                <pre>
                                    {JSON.stringify(location)}
                                </pre>
                            </div>
                        </div>;
                    };
                }
                return function PublicPage(props) {
                    const id = params.id ? Number(params.id) + 1 : 1;
                    const location = useLocation();
                    return <div>
                        <div><Text>Public Page</Text></div>
                        {params.id && <div><Text>Id: {params.id}</Text></div>}
                        <Link data-testid='home' className="mr-2" to={'/'}>Home</Link>
                        <Link data-testid="next" to={`/public/${id}`}>Public {id}</Link>
                        <div>
                            <pre>
                                {JSON.stringify(location)}
                            </pre>
                        </div>
                    </div>;
                };
            }
        }),
        params: {
            ...Object.fromEntries(searchParams.entries()),
            ...rest.length > 0 && {id: rest.join('/')}
        },
        title: method,
        path: action.path,
        location: _store.getState()?.router?.location
    });
};

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
                    'Registration page': 'صفحة التسجيل',
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
                    'Registration page': 'Страница за регистрация',
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
        middleware={[middleware, componentMiddleware, route]}
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

export const PublicPage = Template.bind({});
PublicPage.args = {
    state: merge({}, state, {
        login: null,
        portal: {
            tabs: [],
            publicRoutes: [
                {
                    path: '/',
                    component: 'some.home.page'
                },
                {
                    path: '/public',
                    component: 'some.public.page'
                },
                {
                    path: '/public/:id',
                    component: 'some.other.page'
                }
            ]
        }
    })
};

PublicPage.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    userEvent.click(await canvas.findByTestId('public'));
};
