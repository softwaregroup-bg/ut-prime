import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from './index';
import tap from 'tap';

tap('<Button />', test => {
    test('renders component without break', assert => {
        const { getByTestId } = render(<Button data-testid="Button" />);
        assert.matchSnapshot(getByTestId('Button'), 'Button');
    });

    test('triggers sent onClick function', assert => {
        let clicks = 0;
        const onClick = () => clicks++;
        const { getByTestId } = render(<button data-testid="Button" onClick={onClick} />);
        fireEvent.click(getByTestId('Button'));
        assert(clicks, 1, 'Click was called');
    });
});
