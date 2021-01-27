import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import AddTab from './index';

describe('<AddTab />', () => {
    it('renders component without break', () => {
        const { getByTestId } = render(<AddTab data-testid="AddTab" />);

        expect(getByTestId('AddTab')).toMatchSnapshot();
    });

    it('triggers sent onClick function', () => {
        const onClick = jest.fn();

        const { getByTestId } = render(<button data-testid="AddTab" onClick={onClick} />);

        fireEvent.click(getByTestId('AddTab'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
