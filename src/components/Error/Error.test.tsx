import React from 'react';

import { render } from '../test';
import Error from './index';

describe('<Error />', () => {
    it('render equals snapshot', () => {
        const { getByTestId } = render(<Error />, {error: {open: true}});
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
