import React from 'react';

import { render } from '../test';
import { Basic, Input, Table } from './Form.stories';
import { config } from 'react-transition-group';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('<Form />', () => {
    it('render equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Input render equals snapshot', async() => {
        const { getByTestId, container } = render(<Input {...Input.args} />);
        await Input.play({canvasElement: container});
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Table render equals snapshot', async() => {
        const { getByTestId, container } = render(<Table {...Table.args} />);
        await Table.play({canvasElement: container});
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
