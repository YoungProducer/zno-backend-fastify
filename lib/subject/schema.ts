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
            isSubSubject: { type: 'boolean', default: false },
        },
    },
};
