import React from 'react';

import { render} from '../test';
import Main from './index';

describe('<Main />', () => {
    it('render equals snapshot', () => {
        const { getByTestId } = render(
            <Main />,
            {},
            true
        );
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
