import React from 'react';

import { render, act } from '../test';
import { InputAR } from './Form.stories';
import { config } from 'react-transition-group';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('<Form />', () => {
    jest.setTimeout(60000);
    it('InputAR render equals snapshot', async() => {
        const { getByTestId, container } = render(<InputAR {...InputAR.args} />, undefined, 'ar');
        await act(() => InputAR.play({canvasElement: container}));
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
