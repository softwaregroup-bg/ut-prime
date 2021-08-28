import React from 'react';
import immutable from 'immutable';

import { render } from '../test';
import Gate from './index';

describe('<Gate />', () => {
    it('render equals snapshot', async() => {
        const { getByTestId, findByText } = render(
            <Gate>ready</Gate>, {
                login: {},
                loader: immutable.fromJS({
                    open: true,
                    message: 'Loading...'
                })
            }
        );
        expect(getByTestId('ut-front-test')).toMatchSnapshot('Loading');
        await findByText('ready');
        expect(getByTestId('ut-front-test')).toMatchSnapshot('Ready');
    });
});
