import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Loader from './index';

describe('<Loader />', () => {
    it('renders component without break', () => {
        const { getByTestId } = render(<Loader data-testid="Loader" />);

        expect(getByTestId('Loader')).toMatchSnapshot();
    });

    it('triggers sent onClick function', () => {
        const onClick = jest.fn();

        const { getByTestId } = render(<button data-testid="Loader" onClick={onClick} />);

        fireEvent.click(getByTestId('Loader'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
