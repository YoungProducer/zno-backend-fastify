/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 18 March 2020
 *
 * Schemas for test suite controller.
 */

export const createTestSuite = {
    body: {
        type: 'object',
        required: ['subjectId'],
        properties: {
            subjectId: {
                type: 'string',
            },
            subSubjectId: {
                type: 'string',
            },
            theme: {
                type: 'string',
            },
            session: {
                type: 'string',
            },
            training: {
                type: 'string',
            },
        },
    },
};

export const getTestSuite = {
    querystring: {
        type: 'object',
        required: ['subjectId'],
        properties: {
            subjectId: { type: 'string' },
            subSubjectId: { type: 'string' },
            theme: { type: 'string' },
            session: { type: 'string' },
            training: { type: 'string' },
        },
    },
};
