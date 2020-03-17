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

    async config(id: string): Promise<TSubjectConfig> {
        const config = await prisma
            .subject({ id })
            .config()
            .$fragment(`
                fragment PostWithAuthorsAndComments on Post {
                    subject { name }
                    subSubjects {
                        subject { name }
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
            subSubjects: config.subSubjects.map((subject: any) => ({
                name: subject.subject.name,
                themes: subject.themes,
            })),
            themes: config.themes,
            exams: config.exams,
        };
    }
}

export = SubjectConfigService;
