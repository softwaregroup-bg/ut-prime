import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Error from './index';

export default {
    title: 'Error',
    component: Error,
    decorators: [withReadme(README)],
    args: {
        state: {
            error: {
                open: true
            }
        }
    }
};

export const Basic = () => <Error message='Error message' />;
export const InvalidCredentials = () => <Error />;
export const InterpolateProps = () => <Error message='Error {message}' params={{message: 'message'}} />;
export const InterpolateRedux = () => <Error />;

InvalidCredentials.args = {
    state: {
        error: {
            open: true,
            message: 'Invalid credentials',
            type: 'identity.invalidCredentials'
        }
    }
};

InterpolateRedux.args = {
    state: {
        error: {
            open: true,
            message: 'Error {message}',
            type: 'core.throttle',
            params: {
                message: 'dynamic'
            },
            title: 'Error'
        }
    }
};
