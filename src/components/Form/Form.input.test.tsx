import React from 'react';

import { render, act } from '../test';
import { Input, InputBG, InputAR } from './Form.stories';
import { config } from 'react-transition-group';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('<Form />', () => {
    it('Input render equals snapshot', async() => {
        const { getByTestId, container } = render(<Input {...Input.args} />);
        await act(() => Input.play({canvasElement: container}));
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('InputBG render equals snapshot', async() => {
        const { getByTestId, container } = render(<InputBG {...InputBG.args} />, undefined, 'bg');
        await act(() => InputBG.play({canvasElement: container}));
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('InputAR render equals snapshot', async() => {
        const { getByTestId, container } = render(<InputAR {...InputAR.args} />, undefined, 'ar');
        await act(() => InputAR.play({canvasElement: container}));
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
