import React from 'react';
import {waitFor} from '@testing-library/react';

import { render } from '../test';
import Error from './index';

describe('<Error />', () => {
    it('render equals snapshot', async() => {
        const { getByRole } = render(<Error />, {error: {open: true}});
        await waitFor(() => expect(getByRole('dialog').querySelector('span.p-dialog-title')).toBeTruthy());
        expect(getByRole('dialog')).toMatchSnapshot();
    });
});
