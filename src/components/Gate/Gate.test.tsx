import React from 'react';

import { render } from '../test';
import Gate from './index';
import immutable from 'immutable';

describe('<Gate />', () => {
    it('render equals snapshot', () => {
        const {
            getByTestId
        } = render(
            <Gate />, {
                login: {},
                loader: immutable.fromJS({
                    open: true,
                    message: 'Loading...'
                })
            },
            true
        );
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
