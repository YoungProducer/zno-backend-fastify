/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Service which handles subjects and things related to subject such as create, fetch etc.
 */

/** External imports */

/** Application's imports */
import { prisma, Subject } from '../../prisma/generated/prisma-client';
import { ISubjectService } from './types';

class SubjectService implements ISubjectService {
    async create(name: string): Promise<Subject> {
        const subject = await prisma.createSubject({ name });

        return subject;
    }

    async subjectsNames(): Promise<string[]> {
        const names: any[] = await prisma.subjects().$fragment(`fragment SelectName on Subject { name }`);

        return names.map(subject => subject.name);
    }
}

export = SubjectService;
