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

    async subjects(): Promise<{
        id: string;
        name: string;
    }[]> {
        const subjects: any[] = await prisma.subjects({
            where: {
                isSubSubject: false,
            },
        }).$fragment(`fragment SelectName on Subject { id name }`);

        return subjects;
    }
}

export = SubjectService;
