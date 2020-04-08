/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 18 March 2020
 *
 * Schemas for subject controller.
 */

export const create = {
    body: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string' },
            subSubject: { type: 'boolean', default: false },
        },
    },
};
