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

/** Declare interface for subject */
export interface ISubject {
    name: string;
    themes?: string[];
}

export type TSubjectConfig = ISubject & {
    /** Array which contains subsubjects */
    subSubjects?: ISubject[];
    exams?: {
        /** Training variants */
        trainings?: string[];
        /** Previous exams sessions */
        sessions?: string[];
    }
} | null;

export interface ISubjectService {
    // instance: FastifyInstance;
    create: (name: string) => Promise<Subject>;
    subjectsNames: () => Promise<string[]>;
    // config: (name: string) => Promise<TSubjectConfig>;
}
