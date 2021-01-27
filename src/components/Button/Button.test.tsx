import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Button from './index';

describe('<Button />', () => {
    it('render equals snapshot', () => {
        const { getByTestId } = render(<Button data-testid="Button" />);

        expect(getByTestId('Button')).toMatchSnapshot();
    });

    it('triggers sent onClick function', () => {
        const onClick = jest.fn();

        const { getByTestId } = render(<button data-testid="Button" onClick={onClick} />);

        fireEvent.click(getByTestId('Button'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
