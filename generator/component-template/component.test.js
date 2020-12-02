module.exports = (componentName) => ({
    content: `import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ${componentName} from './index';

describe('<${componentName} />', () => {
    it('renders component without break', () => {
        const { getByTestId } = render(<${componentName} data-testid="${componentName}" />);

        expect(getByTestId('${componentName}')).toMatchSnapshot();
    });

    it('triggers sent onClick function', () => {
        const onClick = jest.fn();

        const { getByTestId } = render(<button data-testid="${componentName}" onClick={onClick} />);

        fireEvent.click(getByTestId('${componentName}'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
`,
    extension: '.test.tsx',
});
