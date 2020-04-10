/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 18 March 2020
 *
 * Schemas for test suite controller.
 */

export const createTestSuite = {
    body: {
        type: 'object',
        required: ['subjectName'],
        properties: {
            subjectName: {
                type: 'string',
            },
            subSubjectName: {
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
            answers: {
                type: 'array',
                item: {
                    type: 'array',
                    item: { type: 'string' },
                },
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

export const uploadImages = {
    params: {
        type: 'object',
        required: ['id', 'type'],
        properties: {
            id: { type: 'string' },
            type: { type: 'string' },
        },
    },
};

export const getTestSuiteImages = {
    params: {
        type: 'object',
        required: ['id', 'type'],
        properties: {
            id: { type: 'string' },
            type: { type: 'string' },
        },
    },
};
