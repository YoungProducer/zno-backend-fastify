/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 18 March 2020
 *
 * Service which handle all operations with test suites.
 */

/** External imports */
import { FastifyInstance } from 'fastify';
import aws from 'aws-sdk';
import HttpErrors from 'http-errors';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

/** Application's imports */
import { prisma, TestSuite, TestSuiteCreateInput, SubjectConfigCreateInput } from '../../prisma/generated/prisma-client';
import {
    ICreateTestSuiteCredentials,
    IGetTestSuiteCredentials,
    IUploadImagesCredentials,
    IGetTestSuiteImagesCredentials,
} from './types';
import { makeId } from '../utils/makeId';
import { uploadFile } from '../utils/uploadFile';

class TestSuiteService {
    s3!: AWS.S3;
    instance!: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.instance = fastify;
        this.s3 = new aws.S3({
            accessKeyId: fastify.config.AWS_ACCESS_KEY_ID,
            secretAccessKey: fastify.config.AWS_SECRET_ACCESS_KEY,
            signatureVersion: 'v4',
            region: 'eu-central-1',
        });
    }

    async create(credentials: ICreateTestSuiteCredentials): Promise<TestSuite> {
        const { subjectName, subSubjectName, tasksImages, explanationsImages, answers, ...other } = credentials;

        const subjectConfigs = await prisma.subjectConfigs({
            where: {
                subject: {
                    name: subjectName,
                },
            },
        });

        if (subjectConfigs.length === 0) {
            // Todo: Create new subject config here.
            await prisma.createSubjectConfig(
                Object
                    .entries(pick(credentials, [
                        'subjectName',
                        // 'subSubjectName',
                        'theme',
                        'training',
                        'session',
                    ]))
                    .reduce((acc, curr) => {
                        if (curr[0] === 'subjectName') {
                            return {
                                ...acc,
                                subject: {
                                    connect: {
                                        name: curr[1],
                                    },
                                },
                            };
                        }

                        if (curr[0] === 'theme') {
                            return {
                                ...acc,
                                themes: {
                                    set: curr[1],
                                },
                            };
                        }

                        if (curr[0] === 'training') {
                            return {
                                ...acc,
                                exams: {
                                    create: {
                                        trainings: {
                                            set: curr[1],
                                        },
                                    },
                                },
                            };
                        }

                        if (curr[0] === 'session') {
                            return {
                                ...acc,
                                exams: {
                                    create: {
                                        sessions: {
                                            set: curr[1],
                                        },
                                    },
                                },
                            };
                        }

                        return acc;
                    }, {}) as SubjectConfigCreateInput,
            );
        } else {
            const subjectConfig = subjectConfigs[0];

            await prisma.updateSubjectConfig({
                where: {
                    id: subjectConfig.id,
                },
                data: Object
                    .entries({
                        theme: credentials.theme,
                        session: credentials.session,
                        training: credentials.training,
                    })
                    .reduce((acc, curr) => {
                        if (curr[0] === 'theme' && curr[1]) {
                            return {
                                ...acc,
                                themes: {
                                    set: subjectConfig.themes.concat(curr[1] as string),
                                },
                            };
                        }

                        if (curr[0] === 'session' && curr[1] && subjectConfig.exams) {
                            return {
                                ...acc,
                                exams: {
                                    create: {
                                        sessions: {
                                            set: subjectConfig.exams.sessions.concat(curr[1]),
                                        },
                                    },
                                },
                            };
                        }

                        if (curr[0] === 'training' && curr[1] && subjectConfig.exams) {
                            return {
                                ...acc,
                                exams: {
                                    create: {
                                        trainings: {
                                            set: subjectConfig.exams.trainings.concat(curr[1]),
                                        },
                                    },
                                },
                            };
                        }

                        return acc;
                    }, {}),
            });
        }

        /** Path where s3 Bucket will storage images related to this test suite */
        let path = `test-suites/${credentials.subjectName}`;

        if (subSubjectName) {
            path = path.concat(`/${credentials.subSubjectName}`);
        }

        if (credentials.theme) {
            path = path.concat(`/themes/${credentials.theme}`);
        } else if (credentials.training) {
            path = path.concat(`/exams/trainings/${credentials.training}`);
        } else if (credentials.session) {
            path = path.concat(`/exams/sessions/${credentials.session}`);
        }

        /** Create test suite */
        const testSuite = await prisma.createTestSuite({
            path,
            ...Object
                .entries(omit(credentials, [
                    'tasksImages',
                    'explanationsImages',
                ]))
                .reduce((acc, curr) => {
                    if (curr[0] === 'subjectName') {
                        return {
                            ...acc,
                            subject: {
                                connect: {
                                    name: curr[1],
                                },
                            },
                        };
                    }

                    if (curr[0] === 'subSubjectName') {
                        return {
                            ...acc,
                            subSubject: {
                                connect: {
                                    name: curr[1],
                                },
                            },
                        };
                    }

                    if (curr[0] === 'answers') {
                        return {
                            ...acc,
                            answers: {
                                create: answers
                                    ? answers.map((answer, index) => ({
                                        answer: {
                                            set: answer.answer,
                                        },
                                        type: answer.type,
                                        taskId: index,
                                    }))
                                    : [],
                            },
                        };
                    }

                    if (curr[1] === null) {
                        return acc;
                    }

                    return {
                        ...acc,
                        [curr[0]]: curr[1],
                    };
                }, {}),
        } as TestSuiteCreateInput);

        /** If tasks images exist in credentials upload them to s3 Bucket and create records in database */
        if (tasksImages) {
            await this.uploadImages({
                id: testSuite.id,
                images: tasksImages,
                type: 'TASK',
            });
        }

        /** If explanations images exist in credentials upload them to s3 Bucket and create records in database */
        if (explanationsImages) {
            await this.uploadImages({
                id: testSuite.id,
                images: explanationsImages,
                type: 'EXPLANATION',
            });
        }

        return testSuite;
    }

    async testSuite(credentials: IGetTestSuiteCredentials): Promise<TestSuite> {
        /** Destruct credentials object */
        const { subjectId, subSubjectId, ...other } = credentials;

        let testSuites;

        if (!subSubjectId) {
            testSuites = await prisma.testSuites({
                where: {
                    subject: {
                        id: subjectId,
                    },
                    ...other,
                },
            });
        } else {
            testSuites = await prisma.testSuites({
                where: {
                    subject: {
                        id: subjectId,
                    },
                    subSubject: {
                        id: subSubjectId,
                    },
                    ...other,
                },
            });
        }

        if (!testSuites || testSuites.length < 1) {
            throw new HttpErrors.NotFound('Тесту з таким параметрами не знайдено.');
        }

        return testSuites[0];
    }

    async uploadImages(credentials: IUploadImagesCredentials): Promise<any> {
        /** Get last image of current test suite */
        const lastImage = await prisma.testSuiteImages({
            where: {
                testSuite: {
                    id: credentials.id,
                },
                type: credentials.type,
            },
            orderBy: 'id_ASC',
            last: 1,
        });

        /** Get index of last task */
        const latsTaskIndex = lastImage.length === 0
            ? 1
            : lastImage[0].taskId + 1;

        /** Get test suite by id */
        const testSuite = await prisma.testSuite({ id: credentials.id });

        /** Check is test suite with this id exist */
        if (!testSuite) {
            throw new HttpErrors[400](`Тесту з таким id: ${credentials.id} не знайдено.`);
        }

        /** Get path of this test suite */
        const path = testSuite.path;

        /** Upload images and get result of uploaded images */
        const data = await Promise.all(credentials.images.map(async (image, index) => {
            const fileName = `${path}/${credentials.type}/${index}_${makeId(16)}.svg`;

            await uploadFile(image);

            /** Create new test suite image instance to database */
            await prisma.createTestSuiteImage({
                testSuite: {
                    connect: {
                        id: testSuite.id,
                    },
                },
                image: fileName,
                taskId: latsTaskIndex + index,
                type: credentials.type,
            });

            return fileName;
        }));

        return data;
    }

    async getTestSuiteImages({ type, id }: IGetTestSuiteImagesCredentials): Promise<string[]> {
        /** Select test suite images by type from database */
        const images = await prisma.testSuite({ id }).images({ where: { type }, orderBy: 'taskId_ASC' });

        const port = this.instance.config.PORT;
        const host = this.instance.config.HOST;
        const protocol = this.instance.config.PROTOCOL;

        const url = `${protocol}://${host}:${port}/uploads`;

        const data = images.map(image => `${url}/${image.image}`);

        return data;
    }
}

export = TestSuiteService;
