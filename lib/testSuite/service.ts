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
import { prisma, TestSuite } from '../../prisma/generated/prisma-client';
import { ICreateTestSuiteCredentials, IGetTestSuiteCredentials } from './types';

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
        const { subjectId, subSubjectId, ...other } = credentials;

        const testSuite = await prisma.createTestSuite({
            subject: {
                connect: {
                    id: subjectId,
                },
            },
            subSubject: {
                connect: {
                    id: subSubjectId,
                },
            },
            ...other,
        });

        return testSuite;
    }

    async testSuite(credentials: IGetTestSuiteCredentials): Promise<TestSuite> {
        /** Destruct credentials object */
        const { subjectId, subSubjectId, ...other } = credentials;

        const testSuites = await prisma.testSuites({
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

        if (!testSuites || testSuites.length < 1) {
            throw new HttpErrors.NotFound('Тесту з таким параметрами не знайдено');
        }

        return testSuites[0];
    }
}

export = TestSuiteService;
