import React from 'react';

import { render, act } from '../test';
import { Table, TableBG, TableAR } from './Form.stories';
import { config } from 'react-transition-group';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('<Form />', () => {
    it('Table render equals snapshot', async() => {
        const { getByTestId, container } = render(<Table {...Table.args} />);
        await act(() => Table.play({canvasElement: container}));
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('TableBG render equals snapshot', async() => {
        const { getByTestId, container } = render(<TableBG {...TableBG.args} />, undefined, 'bg');
        await act(() => TableBG.play({canvasElement: container}));
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('TableAR render equals snapshot', async() => {
        const { getByTestId, container } = render(<TableAR {...TableAR.args} />, undefined, 'ar');
        await act(() => TableAR.play({canvasElement: container}));
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
