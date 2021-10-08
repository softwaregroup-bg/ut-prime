import React from 'react';
import { connect, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Redirect } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import { Theme } from '../Theme';
import { Password, InputText, Button } from '../prime';
import Text from '../Text';
import { Validator } from '../lib/validator';
import { State } from '../Store/Store.types';

import { Styled, StyledType } from './Login.types';
import { identityCheck } from './actions';

const inputTypes = {
    username: {
        name: 'username',
        type: 'text',
        label: 'Username',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength'],
        validations: {
            isRequired: true,
            minLength: 2,
            maxLength: 100
        }
    },
    password: {
        name: 'password',
        type: 'password',
        label: 'Password',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength'],
        validations: {
            isRequired: true,
            minLength: 3,
            maxLength: 100
        }
    },
    newPassword: {
        name: 'newPassword',
        type: 'password',
        label: 'New password',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength'],
        validations: {
            isRequired: true,
            minLength: 3,
            maxLength: 100
        }
    },
    confirmPassword: {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm password',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength', 'shouldMatchField'],
        validations: {
            isRequired: true,
            minLength: 3,
            maxLength: 100,
            shouldMatchField: 'newPassword'
        }
    },
    otp: {
        name: 'otp',
        type: 'password',
        label: 'Otp code',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'length'],
        validations: {
            isRequired: true,
            length: 4
        }
    }
};

const loginSteps = {
    initial: {
        inputs: {
            username: inputTypes.username
        },
        buttonLabel: 'Next',
        title: 'System Login'
    },
    password: {
        inputs: {
            username: inputTypes.username,
            password: inputTypes.password
        },
        disabledFields: ['username'],
        buttonLabel: 'Login',
        title: 'Login with password'
    },
    newPassword: {
        inputs: {
            username: inputTypes.username,
            password: inputTypes.password,
            newPassword: inputTypes.newPassword,
            confirmPassword: inputTypes.confirmPassword
        },
        disabledFields: ['username', 'password'],
        buttonLabel: 'Change',
        title: 'Password change required'
    },
    otp: {
        inputs: {
            username: inputTypes.username,
            otp: inputTypes.otp
        },
        disabledFields: ['username'],
        buttonLabel: 'Login',
        title: 'Login with OTP'
    },
    checkLdapUser: {
        inputs: {
            username: inputTypes.username,
            password: inputTypes.password
        },
        disabledFields: ['username'],
        buttonLabel: 'Login',
        title: 'Login with password'
    }
};

type LoginState = {
    title: string;
    error: string;
    invalidField: string;
    buttonLabel: string;
    inputs: {
        name: string;
        label: string;
        type: string;
        disabled?: boolean;
    }[]
}

type Action = {
    type: 'login',
    methodRequestState?: string,
    error?: {
        type: string,
        message: string
    },
    result?: {}
} | {
    type: 'logout'
} | {
    type: 'error',
    isValid: boolean,
    invalidField: string,
    error: string
};

const updateLoginStep = (state, step) => {
    const loginStep = loginSteps[step];
    const currentInputs = state.inputs;

    const inputs = Object.entries(loginStep.inputs).map(([name, input]: [string, {}]) => ({
        ...input,
        value: currentInputs[name]?.value,
        disabled: loginStep.disabledFields.includes(name)
    }));

    return {
        ...state,
        title: loginStep.title,
        inputs,
        error: '',
        invalidField: '',
        loginType: step
    };
};

function reducer(state: LoginState, action: Action): LoginState {
    switch (action.type) {
        case 'login':
            if (action.methodRequestState !== 'finished') break;
            if (action.error) {
                const err = (action.error.type || '').split('.');
                const type = err[err.length - 1];

                return loginSteps[type] ? updateLoginStep(state, type) : { ...state, error: action.error.message };
            } else if (action.result) {
                return { ...state, error: '', invalidField: '' };
            }
            break;
        case 'error':
            return {...state, error: action.error, invalidField: action.invalidField};
        case 'logout':
            return state;
    }
}

const validator = new Validator(inputTypes);
const initialState: LoginState = {
    error: '',
    invalidField: '',
    ...loginSteps.password,
    inputs: [inputTypes.username, inputTypes.password]
};

const Login: StyledType = ({
    identityCheck,
    classes: {
        loginContainer,
        loginLogo,
        loginPageFooter,
        loginPageHeader,
        loginForm,
        loginTitle,
        formError,
        errorIcon,
        errorMessage,
        formContainer
    }
}) => {
    const {ut} = useTheme<Theme>();
    const authenticated = useSelector((state: State) => state.login);

    const [{ title, error, invalidField, inputs, buttonLabel }, dispatch] = React.useReducer(reducer, initialState);
    if (authenticated) return <Redirect to='/' />;

    async function handleSubmit(e) {
        e.preventDefault();
        const allInputs = Array.prototype.slice.call(e.target.querySelectorAll('input'))
            .reduce((prev, { name, value }) => name ? { ...prev, [name]: value } : prev, {});
        const valid = validator.validateAll(allInputs);
        if (valid.isValid) {
            delete allInputs.confirmPassword;
            dispatch({ ...await identityCheck(allInputs), type: 'login' });
        } else {
            dispatch({...valid, type: 'error'});
        }
    }

    const autoFocus = inputs.find(({disabled}) => !disabled)?.name;

    return (<div className={loginContainer}>
        <div className={clsx(loginLogo, loginPageHeader, ut?.classes?.loginTop)} />
        <Box className={loginForm} boxShadow={3} bgcolor='background.paper' borderColor='divider'>
            {title && <div className={loginTitle}><Text>{title}</Text></div>}
            {error && <div className={formError}>
                <div className={errorIcon} />
                <div className={errorMessage}>{error}</div>
            </div>}
            <form className={clsx('card', formContainer)} onSubmit={handleSubmit} autoComplete='off'>
                {inputs.map(({ name, type, label, disabled }) =>
                    <div key={name} className='field p-float-label'>
                        {
                            type === 'text'
                                ? <InputText
                                        name={name}
                                        disabled={disabled}
                                        autoFocus={autoFocus === name}
                                        className={clsx('w-full', {'p-invalid': invalidField === name})}
                                />
                                : type === 'password'
                                    ? <Password
                                            feedback={false}
                                            name={name}
                                            disabled={disabled}
                                            autoFocus={autoFocus === name}
                                            className={clsx('w-full', {'p-invalid': invalidField === name})}
                                            inputClassName='w-full'
                                    /> : undefined
                        }
                        <label className={clsx({'p-error': invalidField === name})}>{label}</label>
                    </div>
                ).filter(Boolean)}
                <Button label={buttonLabel} type='submit' className='w-full'/>
            </form>
        </Box>
        <div className={clsx(loginLogo, loginPageFooter, ut?.classes?.loginBottom)} />
    </div>
    );
};

export default connect(
    null,
    { identityCheck }
)(Styled(Login));
