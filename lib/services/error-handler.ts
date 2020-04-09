/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 10 March 2020
 *
 * Custom error handler to handle json stringified errors.
 */

/** External imports */
import { FastifyRequest } from 'fastify';
import { IncomingMessage } from 'http';

export const errorHandler = (
    error: any,
    req: FastifyRequest<IncomingMessage>,
) => {
    try {
        let parsedMessage;
        if (error.message) {
            parsedMessage = JSON.parse(error.message);
        }
        if (parsedMessage.message) {
            error.message = parsedMessage.message;
        }

        req.body.error = parsedMessage.errorData;

        return error;
    } catch (e) {
        return error;
    }
};
