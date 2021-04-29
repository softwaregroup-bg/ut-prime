import React from 'react';
import {waitFor} from '@testing-library/react';

import { render} from '../test';
import Main from './index';

describe('<Main />', () => {
    it('render equals snapshot', async() => {
        const { getByTestId } = render(
            <Main />,
            {}
        );
        await waitFor(() => expect(getByTestId('ut-front-test').querySelector('div.p-tabview')).toBeTruthy());
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
