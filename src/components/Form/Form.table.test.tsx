import React from 'react';

import { render, act } from '../test';
import { Table } from './Form.stories';
import { config } from 'react-transition-group';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('<Form />', () => {
    it('Table render equals snapshot', async() => {
        const { getByTestId, container } = render(<Table {...Table.args} />);
        await act(() => Table.play({canvasElement: container}));
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
