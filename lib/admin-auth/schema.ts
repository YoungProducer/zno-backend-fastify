/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 8 April 2020
 *
 * Define schemas for requests.
 */

export const signin = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string' },
            password: { type: 'string', minLength: 8 },
        },
    },
    response: {
        200: {
            type: 'object',
            required: ['id', 'email', 'role'],
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
            },
            additionalProperties: false,
        },
    },
};

export const me = {
    response: {
        200: {
            type: 'object',
            required: ['id', 'email', 'role'],
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
            },
            additionalProperties: false,
        },
    },
};
