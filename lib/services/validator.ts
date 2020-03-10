/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 8 March 2020
 *
 * Validator service to check is credentials are correct.
 */

/** External imports */
import validator from 'isemail';
import HttpErrors from 'http-errors';

/** Application's imports */
import { ISignUpCredentials, TValidationError } from './types';

class ValidatorService {
    validateSignUpCredentials = async (credentials: ISignUpCredentials) => {
        let error: TValidationError = {
            errorFields: [],
            errorMessages: {},
        };

        if (!validator.validate(credentials.email)) {
            error.errorFields.push('email');
            error.errorMessages.email = 'Неправильний шаблон.';
        }

        if (credentials.password.length < 8) {
            error.errorFields.push('password');
            error.errorMessages.password = 'Занад-то короткий пароль.';
        }

        if (
            Object.keys(error.errorMessages).length !== 0
            && error.errorFields.length !== 0
        ) {
            throw new HttpErrors.BadRequest(JSON.stringify({
                errorData: error,
                message: 'Неправильні дані для входу.',
            }));
        }
    }
}

export = ValidatorService;
