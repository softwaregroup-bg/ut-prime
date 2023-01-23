const defaultErrors = {
    400: 'Data failed validation',
    401: 'Session closed or expired',
    403: 'Insufficient permissions for the operation',
    404: 'Resource cannot be found',
    413: 'The uploaded data is bigger than the allowed',
    500: 'Error was received from server. Please try again later'
};

export default error => {
    const returnMsg = error.print || (error.statusCode && defaultErrors[error.statusCode]) || 'Unexpected error';
    if (Array.isArray(error.validation)) {
        return [
            returnMsg,
            ...error.validation.map(({message = ''} = {}) => message)
        ].filter(Boolean).join('\n');
    }
    return returnMsg;
};
