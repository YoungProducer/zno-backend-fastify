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

/** Application's imports */
import { prisma, TestSuite, TestSuiteCreateInput } from '../../prisma/generated/prisma-client';
import {
    ICreateTestSuiteCredentials,
    IGetTestSuiteCredentials,
    IUploadImagesCredentials,
    IGetTestSuiteImagesCredentials,
} from './types';
import { makeId } from '../utils/makeId';

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
                .entries(credentials)
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

    async uploadImages(credentials: IUploadImagesCredentials): Promise<aws.S3.ManagedUpload.SendData[]> {
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
            /** Create upload params */
            const uploadParams = {
                Bucket: this.instance.config.S3_BUCKET,
                Key: `${path}/${credentials.type}/${index}_${makeId(16)}.svg`,
                Body: image.data,
                ContentType: image.mimetype,
            };

            /** Upload image to s3 Bucket */
            const object = await this.s3.upload(uploadParams).promise();

            /** Create new test suite image instance to database */
            await prisma.createTestSuiteImage({
                testSuite: {
                    connect: {
                        id: testSuite.id,
                    },
                },
                image: uploadParams.Key,
                taskId: latsTaskIndex + index,
                type: credentials.type,
            });

            return object;

            // return await this.s3.upload(uploadParams).promise();
        }));

        return data;
    }

    async getTestSuiteImages({ type, id }: IGetTestSuiteImagesCredentials) {
        /** Select test suite images by type from database */
        const images = await prisma.testSuite({ id }).images({ where: { type }, orderBy: 'taskId_ASC' });

        const data = images.map(async (image) => {
            const getParams = {
                Bucket: this.instance.config.S3_BUCKET,
                Key: image.image,
                Expires: 11000,
            };

            return await this.s3.getSignedUrlPromise('getObject', getParams);
        });

        return Promise.all(data);
    }
}

export = TestSuiteService;
