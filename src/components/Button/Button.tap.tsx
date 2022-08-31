import React from 'react';
import { render } from '../test';
import { fireEvent } from '@testing-library/react';

import Button from './index';
import tap from 'tap';

tap.test('<Button />', test => {
    test.test('renders component without break', assert => {
        const { getByTestId } = render(<Button />);
        assert.matchSnapshot(getByTestId('Button'), 'Button');
    });

    test.test('triggers sent onClick function', assert => {
        let clicks = 0;
        const onClick = () => clicks++;
        const { getByTestId } = render(<Button onClick={onClick} />);
        fireEvent.click(getByTestId('Button'));
        assert.equal(clicks, 1, 'Click was called');
    });
});
