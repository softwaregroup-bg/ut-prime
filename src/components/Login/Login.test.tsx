import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Login from './index';

describe('<Login />', () => {
    it('renders component without break', () => {
        const { getByTestId } = render(<Login data-testid="Login" />);

        expect(getByTestId('Login')).toMatchSnapshot();
    });

    it('triggers sent onClick function', () => {
        const onClick = jest.fn();

        const { getByTestId } = render(<button data-testid="Login" onClick={onClick} />);

        fireEvent.click(getByTestId('Login'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
