import React from 'react';

import { render } from '../test';
import { Basic, Input } from './Form.stories';
import { config } from 'react-transition-group';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('<Form />', () => {
    it('render equals snapshot', async() => {
        const { findByTestId } = render(<Basic />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('render equals snapshot', async() => {
        const { getByTestId, container } = render(<Input />);
        await Input.play({canvasElement: container});
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
