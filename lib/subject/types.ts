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

export interface ISubjectService {
    // instance: FastifyInstance;
    create: (name: string) => Promise<Subject>;
    subjectsNames: () => Promise<string[]>;
    // config: (name: string) => Promise<TSubjectConfig>;
}
