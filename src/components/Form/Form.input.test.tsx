import React from 'react';

import { render } from '../test';
import { Input } from './Form.stories';
import { config } from 'react-transition-group';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('<Form />', () => {
    it('Input render equals snapshot', async() => {
        const { getByTestId, container } = render(<Input {...Input.args} />);
        await Input.play({canvasElement: container});
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
