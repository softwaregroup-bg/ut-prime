import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ErrorPopup from './index';

describe('<ErrorPopup />', () => {
    it('renders component without break', () => {
        const { getByTestId } = render(<ErrorPopup data-testid="ErrorPopup" />);

        expect(getByTestId('ErrorPopup')).toMatchSnapshot();
    });

    it('triggers sent onClick function', () => {
        const onClick = jest.fn();

        const { getByTestId } = render(<button data-testid="ErrorPopup" onClick={onClick} />);

        fireEvent.click(getByTestId('ErrorPopup'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
