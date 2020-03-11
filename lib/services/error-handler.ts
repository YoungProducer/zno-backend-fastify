/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 10 March 2020
 *
 * Custom error handler to handle json stringified errors.
 */

import _ from 'lodash';

export const errorHandler = (error: any) => {
    try {
        let parsedMessage;
        if (error.message) {
            parsedMessage = JSON.parse(error.message);
        }
        if (parsedMessage.message) {
            error.message = parsedMessage.message;
        }

        return {
            error,
            data: parsedMessage.errorData || undefined,
        };
    } catch (e) {
        return error;
    }
};
