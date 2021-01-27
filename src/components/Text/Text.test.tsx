import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Text from './index';

describe('<Text />', () => {
    it('renders component without break', () => {
        const { getByTestId } = render(<Text data-testid="Text" />);

        expect(getByTestId('Text')).toMatchSnapshot();
    });

    it('triggers sent onClick function', () => {
        const onClick = jest.fn();

        const { getByTestId } = render(<button data-testid="Text" onClick={onClick} />);

        fireEvent.click(getByTestId('Text'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
