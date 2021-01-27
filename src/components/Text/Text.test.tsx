import React from 'react';

import { render } from '../test';
import Text from './index';

describe('<Text />', () => {
    it('render equals snapshot', () => {
        const { getByTestId } = render(<Text>text</Text>);
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
