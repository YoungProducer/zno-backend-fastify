/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 11 March 2020
 */

/** External imports */
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import aws from 'aws-sdk';

/** Application's imports */
import { prisma, SubSubjectCreateInput, SubjectConfigCreateInput } from '../../prisma/generated/prisma-client';
import { TSubjectConfig } from './types';

class SubjectConfigService {
    async create(config: TSubjectConfig) {
        const subjectConfig = await prisma.createSubjectConfig(
            Object
                .entries(config)
                .reduce((acc, curr) => {
                    if (curr[0] === 'name') {
                        return {
                            ...acc,
                            subject: {
                                connect: { name: curr[1] },
                            },
                        };
                    }

                    if (curr[0] === 'exams') {
                        return {
                            ...acc,
                            exams: {
                                create: Object
                                    .entries(curr[1])
                                    .reduce((exams, exam) => {
                                        if (exam[1] === null) return exams;

                                        return {
                                            ...exams,
                                            [exam[0]]: exam[1],
                                        };
                                    }, {}),
                            },
                        };
                    }

                    if (curr[0] === 'subSubjects') {
                        return {
                            ...acc,
                            subSubjects: {
                                create: (curr[1] as any[]).map(subject => ({
                                    subject: {
                                        connect: {
                                            name: subject.name,
                                        },
                                    },
                                })),
                            },
                        };
                    }

                    if (curr[1] === null) return acc;

                    return {
                        ...acc,
                        [curr[0]]: curr[1],
                    };
                }, {}) as SubjectConfigCreateInput);

        return subjectConfig;
    }

    async config(id: string): Promise<TSubjectConfig> {
        const config = await prisma
            .subject({ id })
            .config()
            .$fragment(`
                fragment PostWithAuthorsAndComments on Post {
                    subject { id name }
                    subSubjects {
                        subject { id name }
                        themes
                    }
                    themes
                    exams {
                        trainings
                        sessions
                    }
                }`) as any;

        return {
            name: config.subject.name,
            id: config.subject.id,
            subSubjects: config.subSubjects.map((subject: any) => ({
                id: subject.subject.id,
                name: subject.subject.name,
                themes: subject.themes,
            })),
            themes: config.themes,
            exams: config.exams,
        };
    }
}

export = SubjectConfigService;
