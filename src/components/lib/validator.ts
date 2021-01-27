const validators = {
    isRequired: (value) => {
        return !!value && !!String(value).trim();
    },
    minLength: (value, minLength) => {
        return value.length >= minLength;
    },
    maxLength: (value, maxLength) => {
        return value.length <= maxLength;
    },
    shouldMatchField: (value, shouldMatch, inputs) => {
        if (inputs && inputs.getIn([shouldMatch, 'value']) !== '') {
            return inputs.getIn([shouldMatch, 'value']) === value;
        }

        return true;
    },
    length: (value, length) => {
        return value.length === length;
    },
    regex: (value, regex) => {
        const regexPattern = new RegExp(regex);
        return regexPattern.test(value);
    },
    numbersOnly: (value, shouldBeValidated) => {
        if (shouldBeValidated) {
            return /^\d+$/.test(value);
        }
        return true;
    }
};

const defaultErrorMessagingMapping = {
    isRequired: ({ input }) => {
        return 'Field required';
    },
    minLength: ({ input, minLength }) => {
        return `Field must be at least ${minLength} characters`;
    },
    maxLength: ({ input, maxLength }) => {
        return `Field must be at most ${maxLength} characters`;
    },
    shouldMatchField: ({ input, shouldMatchField }) => {
        return 'Passwords do not match';
    },
    length: ({ input, length }) => {
        return `OTP code must be exactly ${length} characters long`;
    },
    numbersOnly: ({ input }) => {
        return 'Please enter only numeric characters.';
    },
    regex: ({ input }) => {
        return 'Invalid field.';
    }
};

export class Validator {
    config: {};
    errorMapping: any;

    constructor(config) {
        this.config = config;
        this.errorMapping = Object.assign({}, defaultErrorMessagingMapping, config.errorMessagingMapping);
    }

    validateInput(input, value, inputs) {
        if (!this.config[input]) {
            // If there is no validation for this input - simulate passing validation
            return {
                isValid: true,
                error: ''
            };
        }
        const { validations, validateOrder, cascadeParent } = this.config[input];
        let error = '';

        validateOrder.every((validationRule) => {
            let isValid = validators[validationRule](value, validations[validationRule], inputs);

            if (cascadeParent && !inputs.get(cascadeParent)) {
                isValid = true;
            }
            if (!isValid) {
                error = this.errorMapping[validationRule]({...validations, input});
            }

            return isValid;
        });

        return {
            isValid: !error,
            error
        };
    }

    validateAll(inputs) {
        let validationError = '';
        let invalidField = '';

        const isValid = Object.entries(inputs).every(([key, value]) => {
            const validationResult = this.validateInput(key, value, inputs);
            validationError = validationResult.error;
            invalidField = !validationResult.isValid ? key : '';

            return validationResult.isValid;
        }, this);

        return {
            isValid,
            invalidField,
            error: validationError
        };
    }
}
