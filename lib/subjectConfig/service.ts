/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 11 March 2020
 */

/** External imports */
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

/** Application's imports */
import { prisma, SubSubjectCreateInput } from '../../prisma/generated/prisma-client';
import { TSubjectConfig } from './types';

class SubjectConfigService {
    async create(config: TSubjectConfig) {
        const subSubjects = await prisma.subjects({
            where: {
                parent: {
                    name: config.name,
                },
            },
        });

        console.log(subSubjects);

        const subjectConfig = await prisma.createSubjectConfig({
            subject: {
                connect: {
                    name: config.name,
                },
            },
            themes: {
                set: config.themes || [],
            },
            exams: {
                create: {
                    sessions: {
                        set: config.exams ? config.exams.sessions : [],
                    },
                    trainings: {
                        set: config.exams ? config.exams.trainings : [],
                    },
                },
            },
            // subSubjects: {
            //     create: subSubjects.map(subject => {
            //         return {
            //             subject: {
            //                 connect: {
            //                     id: subject.id,
            //                 },
            //             },
            //         };
            //     }),
            // },
            subSubjects: {
                create: config.subSubjects ? config.subSubjects.map(subject => {
                    return {
                        subject: {
                            connect: {
                                name: subject.name,
                            },
                        },
                    };
                }) : undefined,
            },
        });

        return subjectConfig;
    }
}

export = SubjectConfigService;
