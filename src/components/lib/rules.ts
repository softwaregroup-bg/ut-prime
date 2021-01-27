// Each function names corresponds to each validation rule type (constants.types)

import { defaultErrorMessage } from './constants';

const numbersOnlyRegex = /^[0-9]+$/;

/* Text Validation */
export const isRequiredRule = (prop, rule, result) => {
    checkPassedResultObject(result);

    const trimmed = prop ? (prop.trim ? prop.trim() : prop) : '';
    if (!prop || trimmed.length === 0) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const lengthRule = (val, minVal, maxVal, rule, result) => {
    checkPassedResultObject(result);

    const trimmedValue = val ? (val.trim ? val.trim() : val) : '';
    if (trimmedValue && (trimmedValue.length < minVal || trimmedValue.length > maxVal)) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const regexRule = (val, regex, rule, result) => {
    if (!val) {
        return true;
    }
    checkPassedResultObject(result);

    const regexPattern = new RegExp(regex);
    const regexResult = regexPattern.test(val);
    if (!regexResult) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const isUniqueValueRule = (val, values, rule, result) => {
    checkPassedResultObject(result);

    if (values.indexOf(val) > -1) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const isRequiredOnConditionRule = (prop, shouldValidateProp, rule, result, condition) => {
    if (typeof condition === 'boolean') {
        shouldValidateProp = !!shouldValidateProp;
    }
    if (!shouldValidateProp || shouldValidateProp !== condition) {
        return;
    }

    checkPassedResultObject(result);

    const trimmed = prop ? (prop.trim ? prop.trim() : prop) : '';
    if (!prop || trimmed.length === 0 || prop === '__placeholder__') {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

const charCodeA = 'A'.charCodeAt(0);

/**
 * An IBAN is validated by converting it into an integer and performing a basic mod-97 operation (as described in ISO 7064) on it.
 * If the IBAN is valid, the remainder equals 1.[Note 1] The algorithm of IBAN validation is as follows:
 * Check that the total IBAN length is correct as per the country. If not, the IBAN is invalid.
 * Move the four initial characters to the end of the string.
 * Replace each letter in the string with two digits, thereby expanding the string, where A = 10, B = 11, ..., Z = 35.
 * Interpret the string as a decimal integer and compute the remainder of that number on division by 97.
 * @param {String} value
 * @param {Object} rule
 * @param {Object} result
 */
export const isValidIBANRule = (value, rule, result) => {
    checkPassedResultObject(result);
    const length = value && value.length;
    if (!length) {
        return;
    }
    if (length < 15 || length > 30) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
        return;
    }

    const firstFourChars = value.substring(0, 4);
    const restOfIban = value.substring(value.length - (value.length - 4));
    const rearrangedIban = `${restOfIban}${firstFourChars}`;
    const ibanCharValues = [];

    for (let i = 0; i < rearrangedIban.length; i++) {
        const char = rearrangedIban[i];
        if (!isNaN(Number(char))) {
            ibanCharValues.push(char);
        } else if (char >= 'A' && char <= 'Z') {
            ibanCharValues.push(10 + char.charCodeAt(0) - charCodeA);
        }
    }

    let ibanToValidate = ibanCharValues.join('');

    while (ibanToValidate.length > 2) {
        const block = ibanToValidate.slice(0, 9);
        ibanToValidate = parseInt(block, 10) % 97 + ibanToValidate.slice(block.length);
    }

    if (parseInt(ibanToValidate, 10) % 97 !== 1) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End text validation */

/* Array Validation */

export const lengthRuleArray = (values, minVal, maxVal, rule, result) => {
    checkPassedResultObject(result);
    values.forEach(val => {
        const value = val.get('value') || val.get('phoneNumber');
        if (value && (value.length < minVal || value.length > maxVal)) {
            result.isValid = false;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const isRequiredArrayRule = (props, rule, result) => {
    checkPassedResultObject(result);

    if (!props || (props && props.length <= 0) || (props && props.size <= 0)) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};
/* End array validation */

/* Array with Text Validation */
export const arrayWithTextLengthRule = (array, textProp, minVal, maxVal, rule, result) => {
    checkPassedResultObject(result);

    array.forEach((item, index) => {
        const currentValue = item.getIn(textProp);
        if (currentValue && (currentValue.length < minVal || currentValue.length > maxVal)) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithTextIsRequiredRule = (array, textProp, rule, result) => {
    checkPassedResultObject(result);

    array.forEach((item, index) => {
        const currentValue = item.getIn(textProp);
        const trimmed = currentValue ? (currentValue.trim ? currentValue.trim() : currentValue) : '';
        if (!currentValue || trimmed.length === 0) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithTextIsRequiredRuleOptional = (array, textProp, shouldValidateProp, rule, result) => {
    checkPassedResultObject(result);

    array.forEach((item, index) => {
        const shouldValidate = item.getIn(shouldValidateProp);
        if (!shouldValidate) {
            return;
        }
        const currentValue = item.getIn(textProp);
        let trimmed;
        if (isNaN(currentValue)) {
            trimmed = currentValue ? currentValue.trim() : '';
        } else {
            trimmed = currentValue;
        }
        if (!currentValue || trimmed.length === 0) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithTextIsNumberOnlyRuleOptional = (array, textProp, shouldValidateProp, rule, result) => {
    checkPassedResultObject(result);

    array.forEach((item, index) => {
        const shouldValidate = item.getIn(shouldValidateProp);
        if (!shouldValidate) {
            return;
        }
        const currentValue = item.getIn(textProp);
        if (currentValue !== '' && !(numbersOnlyRegex.test(currentValue))) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithTextIsNumberOnlyRule = (array, textProp, rule, result) => {
    checkPassedResultObject(result);

    array.forEach((item, index) => {
        const currentValue = item.getIn(textProp);
        if (currentValue !== '' && !(numbersOnlyRegex.test(currentValue))) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithArrayIsRequiredRule = (array, textProp, rule, result) => {
    checkPassedResultObject(result);

    array.forEach((item, index) => {
        const currentValue = item.getIn(textProp);
        if (currentValue && (currentValue.size === 0 || currentValue.length === 0)) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithDropdownIsRequiredRule = (array, textProp, rule, result) => {
    checkPassedResultObject(result);

    array.forEach((item, index) => {
        const currentValue = item.getIn(textProp);
        if (!currentValue) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

/* End array with text validation */

/* Dropdown Validation */
export const isRequiredDropdownRule = (props, rule, result) => {
    checkPassedResultObject(result);

    if (!props) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};
/* End Dropdown validation */

/* Default role validation */

export const defaultRoleRule = (props, roles, rule, result) => {
    checkPassedResultObject(result);

    const assignedRoles = roles.filter(role => (role.get('isAssigned')));
    if (!props && assignedRoles.size > 0) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End Default role validation */

/* isNumber validation */

export const isNumberOnlyRule = (props, rule, result) => {
    checkPassedResultObject(result);

    if (props !== '' && !(numbersOnlyRegex.test(props))) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End isNumber validation */

export const isIntegerOnlyRule = (props, rule, result) => {
    checkPassedResultObject(result);

    const regex = /^-?\d+$/;
    if (props && !(regex.test(props))) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const isIntegerRangeRule = (props, rule, result) => {
    checkPassedResultObject(result);
    if (props && /^-?\d+$/.test(props)) {
        const value = parseInt(props);
        if (rule.minVal == null) {
            rule.minVal = null;
        }
        if (rule.maxVal == null) {
            rule.maxValue = null;
        }
        if (rule.minVal !== null && value < rule.minVal) {
            result.isValid = false;
            result.errors.push(getErrorObject(rule));
        }
        if (rule.maxVal !== null && value > rule.maxVal) {
            result.isValid = false;
            result.errors.push(getErrorObject(rule));
        }
    }
};

/**
 * isDecimal validation
 *
 * Validates that the field is numeric, or numeric with decimal point.
 * Scale and precision must be specified.
 * @param {String} value - the value to validate
 * @param {Number} precision - total count of number characters
 * @param {Number} scale - number of characters after the decimal point.
 */
export const isDecimalOnlyRule = (value, precision, scale, rule, result) => {
    checkPassedResultObject(result);
    if (!value) {
        return true;
    }
    const digitsLeftOfDecimalPoint = precision - scale;
    const regex = new RegExp('^(\\d{0,' + digitsLeftOfDecimalPoint + '}\\.?\\d{0,' + scale + '}|\\.\\d{1,' + scale + '})$');

    if (value !== '' && !(regex.test(value))) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End isDecimal validation */

/* Is valid email validation */

export const isValidEmailRule = (props, rule, result) => {
    checkPassedResultObject(result);

    const regex = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (props !== '' && !(regex.test(props))) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End is valid email validation */
/* isNumber array validation */

export const isNumberOnlyRuleArray = (props, rule, result) => {
    checkPassedResultObject(result);
    const propsMutable = (typeof (props && props.toJS) === 'function') ? props.toJS() : props;
    propsMutable.forEach(prop => {
        const value = prop.value || prop.phoneNumber;
        if (value !== '' && !numbersOnlyRegex.test(value)) {
            result.isValid = false;
            result.errors.push(getErrorObject(rule));
        }
    });
};

/* End isNumber array validation */

/* Is valid email array validation */

export const isValidEmailRuleArray = (props, rule, result) => {
    const regex = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    checkPassedResultObject(result);

    props.forEach(prop => {
        if (prop.get('value') !== '' && !(regex.test(prop.get('value')))) {
            result.isValid = false;
            result.errors.push(getErrorObject(rule));
        }
    });
};

const uniformCivilNumberLength = 10;
const uniformCivilNumbersWights = [2, 4, 8, 5, 10, 9, 7, 3, 6];

function isDateValid(month, day, year) {
    if (year < 1000 || year > 3000 || month <= 0 || month > 12) {
        return false;
    }
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
        monthLength[1] = 29;
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}

export const isValidUniformCivilNumberRule = (props, rule, result) => {
    checkPassedResultObject(result);
    let isValid = true;
    const valueToCheck = props.toString();
    if (valueToCheck.length !== uniformCivilNumberLength || !numbersOnlyRegex.test(props)) {
        isValid = false;
    } else {
        const year = Number(valueToCheck.substring(0, 2));
        const month = Number(valueToCheck.substring(2, 4));
        const day = Number(valueToCheck.substring(4, 6));
        if (month > 40) {
            if (!isDateValid(month - 40, day, year + 2000)) {
                isValid = false;
            }
        } else if (month > 20) {
            if (!isDateValid(month - 20, day, year + 1800)) {
                isValid = false;
            }
        } else {
            if (!isDateValid(month, day, year + 1900)) {
                isValid = false;
            }
        }
        const checkSum = Number(valueToCheck[9]);
        let uniformCivilNumberSum = 0;
        for (let i = 0; i < uniformCivilNumberLength - 1; i++) {
            uniformCivilNumberSum += Number(valueToCheck[i]) * uniformCivilNumbersWights[i];
        }
        let validCheckSum = uniformCivilNumberSum % 11;
        if (validCheckSum === 10) {
            validCheckSum = 0;
        }
        if (checkSum !== validCheckSum) {
            isValid = false;
        }
    }
    if (!isValid) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End is valid email array validation */

/* Object validation */

export const hasKeysRule = (props, rule, result) => {
    checkPassedResultObject(result);
    if (props.keySeq().size <= 0) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End Object validation */

/* Custom function validation */

export const customFunctionRule = ({ sourceMap, currentValue }, rule, result) => {
    const validator = rule.validator;
    if (!validator({ sourceMap, currentValue })) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End custom function validation */

function checkPassedResultObject(result) {
    result = result || {};
    result.errors = result.errors || [];
}

function getErrorObject(rule) {
    return {
        ...rule,
        errorMessage: getErrorMessage(rule.errorMessage)
    };
}

function getErrorMessage(message) {
    return message || defaultErrorMessage;
}
