"use strict";
/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Schemas for auth controller.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = {
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
            },
            additionalProperties: false,
        },
    },
};
exports.signin = {
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
exports.me = {
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
            },
            additionalProperties: false,
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2F1dGgvc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7R0FLRzs7QUFFVSxRQUFBLE1BQU0sR0FBRztJQUNsQixJQUFJLEVBQUU7UUFDRixJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7UUFDL0IsVUFBVSxFQUFFO1lBQ1IsS0FBSyxFQUFFO2dCQUNILElBQUksRUFBRSxRQUFRO2FBQ2pCO1lBQ0QsUUFBUSxFQUFFO2dCQUNOLElBQUksRUFBRSxRQUFRO2FBQ2pCO1NBQ0o7UUFDRCxvQkFBb0IsRUFBRSxLQUFLO0tBQzlCO0lBQ0QsUUFBUSxFQUFFO1FBQ04sR0FBRyxFQUFFO1lBQ0QsSUFBSSxFQUFFLFFBQVE7WUFDZCxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUNqQyxVQUFVLEVBQUU7Z0JBQ1IsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtnQkFDdEIsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtnQkFDekIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTthQUMzQjtZQUNELG9CQUFvQixFQUFFLEtBQUs7U0FDOUI7S0FDSjtDQUNKLENBQUM7QUFFVyxRQUFBLE1BQU0sR0FBRztJQUNsQixJQUFJLEVBQUU7UUFDRixJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7UUFDL0IsVUFBVSxFQUFFO1lBQ1IsS0FBSyxFQUFFO2dCQUNILElBQUksRUFBRSxRQUFRO2FBQ2pCO1lBQ0QsUUFBUSxFQUFFO2dCQUNOLElBQUksRUFBRSxRQUFRO2FBQ2pCO1lBQ0QsUUFBUSxFQUFFO2dCQUNOLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxvQkFBb0IsRUFBRSxLQUFLO0tBQzlCO0lBQ0QsUUFBUSxFQUFFO1FBQ04sR0FBRyxFQUFFO1lBQ0QsSUFBSSxFQUFFLFFBQVE7WUFDZCxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUNqQyxVQUFVLEVBQUU7Z0JBQ1IsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtnQkFDdEIsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtnQkFDekIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTthQUMzQjtZQUNELG9CQUFvQixFQUFFLEtBQUs7U0FDOUI7S0FDSjtDQUNKLENBQUM7QUFFVyxRQUFBLEVBQUUsR0FBRztJQUNkLE1BQU0sRUFBRTtRQUNKLG9CQUFvQixFQUFFLEtBQUs7S0FDOUI7SUFDRCxRQUFRLEVBQUU7UUFDTixHQUFHLEVBQUU7WUFDRCxJQUFJLEVBQUUsUUFBUTtZQUNkLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ2pDLFVBQVUsRUFBRTtnQkFDUixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2dCQUN0QixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2dCQUN6QixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2FBQzNCO1lBQ0Qsb0JBQW9CLEVBQUUsS0FBSztTQUM5QjtLQUNKO0NBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieTogT2xla3NhbmRyIEJlenJ1a292XG4gKiBDcmVhdGlvbiBkYXRlOiA5IE1hcmNoIDIwMjBcbiAqXG4gKiBTY2hlbWFzIGZvciBhdXRoIGNvbnRyb2xsZXIuXG4gKi9cblxuZXhwb3J0IGNvbnN0IHNpZ251cCA9IHtcbiAgICBib2R5OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWydlbWFpbCcsICdwYXNzd29yZCddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBlbWFpbDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgfSxcbiAgICByZXNwb25zZToge1xuICAgICAgICAyMDA6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFsnaWQnLCAnZW1haWwnLCAncm9sZSddLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIGlkOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICAgICAgZW1haWw6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgICByb2xlOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgIH0sXG59O1xuXG5leHBvcnQgY29uc3Qgc2lnbmluID0ge1xuICAgIGJvZHk6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ2VtYWlsJywgJ3Bhc3N3b3JkJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW1lbWJlcjoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICB9LFxuICAgIHJlc3BvbnNlOiB7XG4gICAgICAgIDIwMDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogWydpZCcsICdlbWFpbCcsICdyb2xlJ10sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgaWQ6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgICBlbWFpbDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgIHJvbGU6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBtZSA9IHtcbiAgICBwYXJhbXM6IHtcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgIH0sXG4gICAgcmVzcG9uc2U6IHtcbiAgICAgICAgMjAwOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2lkJywgJ2VtYWlsJywgJ3JvbGUnXSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICBpZDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgIGVtYWlsOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICAgICAgcm9sZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICB9LFxufTtcbiJdfQ==