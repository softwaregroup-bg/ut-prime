import React from 'react';
import {waitFor} from '@testing-library/react';

import { render } from '../test';
import Error from './index';

describe('<Error />', () => {
    it('render equals snapshot', async() => {
        const {
            getByRole
        } = render(<Error />, {
            error: {
                open: true,
                title: '',
                type: '',
                message: '',
                details: '',
                params: {},
                statusCode: 200
            }
        });
        await waitFor(() => expect(getByRole('dialog').querySelector('div.p-dialog-title')).toBeTruthy());
        expect(getByRole('dialog')).toMatchSnapshot();
    });
    it('interpolate equals snapshot', async() => {
        const {
            getByText
        } = render(<Error />, {
            error: {
                open: true,
                title: '',
                type: '',
                message: 'Error {message}',
                details: '',
                params: {
                    message: 'dynamic param'
                },
                statusCode: 200
            }
        });
        await waitFor(() => expect(getByText('Error dynamic param')).toBeTruthy());
        expect(getByText('Error dynamic param')).toMatchSnapshot();
    });
});
