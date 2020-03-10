/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 10 March 2020
 *
 * Custom error handler to handle json stringified errors.
 */

export const errorHandler = (error: any) => {
    try {
        return JSON.parse(error);
    } catch (e) {
        return error;
    }
};
