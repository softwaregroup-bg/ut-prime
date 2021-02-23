import React from 'react';
import {waitFor} from '@testing-library/react';

import { render} from '../test';
import Main from './index';

describe('<Main />', () => {
    it('render equals snapshot', async() => {
        const { getByTestId } = render(
            <Main />,
            {},
            true
        );
        await waitFor(() => expect(getByTestId('ut-front-test').querySelector('div.dx-box')).toBeTruthy());
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
