import React from 'react';

import {Button} from '../prime';

import {ComponentProps} from './SubmitButton.types';

const SubmitButton: ComponentProps = ({method, params, submit, ...props}) => {
    const handleClick = React.useCallback(event => {
        event.method = method;
        event.params = params;
        submit(event);
    }, [submit, method, params]);
    return <Button onClick={submit && handleClick} {...props} />;
};

export default SubmitButton;
