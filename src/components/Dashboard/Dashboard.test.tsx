import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Dashboard from './index';

describe('<Dashboard />', () => {
    it('renders component without break', () => {
        const { getByTestId } = render(<Dashboard data-testid="Dashboard" />);

        expect(getByTestId('Dashboard')).toMatchSnapshot();
    });

    it('triggers sent onClick function', () => {
        const onClick = jest.fn();

        const { getByTestId } = render(<button data-testid="Dashboard" onClick={onClick} />);

        fireEvent.click(getByTestId('Dashboard'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
