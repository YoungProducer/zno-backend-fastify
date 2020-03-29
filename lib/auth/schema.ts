/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Schemas for auth controller.
 */

export const signup = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
            },
            password: {
                type: 'string',
            },
        },
        additionalProperties: false,
    },
    response: {
        200: {
            type: 'object',
            required: ['id', 'email', 'role'],
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                emailConfirmed: { type: 'boolean' },
            },
            additionalProperties: false,
        },
    },
};

export const signin = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
            },
            password: {
                type: 'string',
            },
            remember: {
                type: 'boolean',
            },
        },
        additionalProperties: false,
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
    params: {
        additionalProperties: false,
    },
    response: {
        200: {
            type: 'object',
            required: ['id', 'email', 'role'],
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                emailConfirmed: { type: 'boolean' },
            },
            additionalProperties: false,
        },
    },
};
