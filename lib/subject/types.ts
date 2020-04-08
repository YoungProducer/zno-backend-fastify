/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Declare main types and interfaces related to subject controller and service.
 */

/** External imports */
import { FastifyInstance } from 'fastify';

/** Application's imports */
import { Subject } from '../../prisma/generated/prisma-client';

export namespace SubjectTypes {
    export interface CreatePayload {
        name: string;
        subSubject: boolean;
    }
}

export interface ISubjectService {
    create: (payload: SubjectTypes.CreatePayload) => Promise<Subject>;
    subjects: (subSubject: boolean) => Promise<{
        id: string;
        name: string;
    }[]>;
}
