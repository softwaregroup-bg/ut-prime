module.exports = (componentName) => ({
    content: `import React from 'react';

import { render } from '../test';
import { Basic } from './${componentName}.stories';

describe('<${componentName} />', () => {
    it('Basic render equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
`,
    extension: '.test.tsx'
});
