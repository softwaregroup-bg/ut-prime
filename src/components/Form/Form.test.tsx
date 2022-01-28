import React from 'react';

import { render } from '../test';
import { Basic, Input } from './Form.stories';

describe('<Form />', () => {
    it('render equals snapshot', async() => {
        const { findByTestId } = render(<Basic />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('render equals snapshot', async() => {
        const { findByTestId } = render(<Input />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
