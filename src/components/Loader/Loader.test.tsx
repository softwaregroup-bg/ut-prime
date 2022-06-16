import React from 'react';

import { render } from '../test';
import Loader from './index';

describe('<Loader />', () => {
    it('render equals snapshot', () => {
        const {
            getByTestId
        } = render(<Loader />, {
            loader: {
                open: true,
                requests: 0,
                message: 'Loading...'
            }
        });
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
