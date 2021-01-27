module.exports = (componentName) => ({
    content: `import React from 'react';
import { fireEvent } from '@testing-library/react';

import { render } from '../test';
import ${componentName} from './index';

describe('<${componentName} />', () => {
    it('render equals snapshot', () => {
        const { getByTestId } = render(<${componentName} />);
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });

    it('triggers sent onClick function', () => {
        const onClick = jest.fn();
        const { getByTestId } = render(<${componentName} onClick={onClick} />);
        fireEvent.click(getByTestId('${componentName}'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
`,
    extension: '.test.tsx'
});
