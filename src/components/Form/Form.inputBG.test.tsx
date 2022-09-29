import React from 'react';

import { render, act } from '../test';
import { InputBG } from './Form.stories';
import { config } from 'react-transition-group';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('<Form />', () => {
    jest.setTimeout(6000);
    it('InputBG render equals snapshot', async() => {
        const { getByTestId, container } = render(<InputBG {...InputBG.args} />, undefined, 'bg');
        await act(() => InputBG.play({canvasElement: container}));
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
