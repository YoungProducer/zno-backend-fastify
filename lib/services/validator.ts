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
import { ISignUpCredentials } from './types';

class ValidatorService {
    validateSignUpCredentials = async (credentials: ISignUpCredentials) => {
        if (credentials.email === undefined || credentials.password === undefined) {
            throw new HttpErrors.UnprocessableEntity('Неправильний емеїл або пароль');
        }

        if (!validator.validate(credentials.email)) {
            throw new HttpErrors.Unauthorized('Неправильний шаблон.');
        }

        if (credentials.password.length < 8) {
            throw new HttpErrors.Unauthorized('Занад-то короткий пароль.');
        }
    }
}

export = ValidatorService;
