export const defaultErrorMessage = 'Invalid';

export const validationTypes = {
    text: 'text',
    array: 'array',
    arrayWithTextElements: 'arrayWithTextElements', // keyArray, keyText
    arrayWithTextElementsOptional: 'arrayWithTextElementsOptional', // keyArray, keyText, shouldValidateProp
    arrayWithDropdownElements: 'arrayWithDropdownElements', // keyArray, keyText
    arrayWithArrayElements: 'arrayWithArrayElements', // keyArray, keyText
    dropdown: 'dropdown',
    radio: 'radio',
    defaultRole: 'defaultRole',
    custom: 'custom',
    object: 'object'
};

export const textValidations = {
    isRequired: 'isRequired',
    isRequiredOnCondition: 'isRequiredOnCondition',
    email: 'email',
    numberOnly: 'numberOnly',
    integerOnly: 'integerOnly',
    integerRange: 'integerRange', // minVal?, maxVal?
    decimalOnly: 'decimalOnly', // precision, scale
    uniqueValue: 'uniqueValue',
    uniqueValueCaseInsensitive: 'uniqueValueCaseInsensitive',
    uniformCivilNumber: 'uniformCivilNumber',
    length: 'length', // minVal, maxVal
    regex: 'regex', // value,
    iban: 'iban'
};

export const arrayValidations = {
    isRequired: 'isRequired',
    uniqueValue: 'uniqueValue',
    email: 'email',
    numberOnly: 'numberOnly'
};

export const dropdownValidations = {
    isRequired: 'isRequired',
    isRequiredOnCondition: 'isRequiredOnCondition'
};

export const defaultRoleValidations = {
    isRequired: 'isRequired'
};

export const objectValidations = {
    hasKeys: 'hasKeys'
};

export const customValidations = {
    function: 'function'
};
