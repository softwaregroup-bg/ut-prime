import React from 'react';

import { render, act } from '../test';
import { Input, CurrencyScale } from './Form.stories';
import { config } from 'react-transition-group';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('<Form />', () => {
    jest.setTimeout(60000);
    it('Input render equals snapshot', async() => {
        const { getByTestId, container } = render(<Input {...Input.args} />);
        await act(() => Input.play({canvasElement: container}));
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('CurrencyScale render equals snapshot', async() => {
        const { getByTestId } = render(<CurrencyScale {...CurrencyScale.args} />);
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
