import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Gate from './index';

describe('<Gate />', () => {
    it('renders component without break', () => {
        const { getByTestId } = render(<Gate data-testid="Gate" />);

        expect(getByTestId('Gate')).toMatchSnapshot();
    });

    it('triggers sent onClick function', () => {
        const onClick = jest.fn();

        const { getByTestId } = render(<button data-testid="Gate" onClick={onClick} />);

        fireEvent.click(getByTestId('Gate'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
