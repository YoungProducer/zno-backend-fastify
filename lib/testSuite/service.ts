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
import { prisma, TestSuiteCreateInput, SubjectConfigCreateInput } from '../../prisma/generated/prisma-client';
import {
    ICreateTestSuiteCredentials,
    IGetTestSuiteCredentials,
    IUploadImagesCredentials,
    IGetTestSuiteImagesCredentials,
} from './types';
import { makeId } from '../utils/makeId';
import { uploadFile } from '../utils/uploadFile';
import { testSuiteModel, TestSuite, TestSuitePopulated } from '../models/testSuite';
import { TestSuiteImage, testSuiteImageModel } from '../models/testSuiteImage';
import '../models/testSuiteImage';
import { subjectConfigModel, SubjectConfigPopulated } from '../models/subjectConfig';
import { subjectModel } from '../models/subject';

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

        console.log(credentials);

        const subject = await subjectModel
            .findOne({
                name: subjectName,
            })
            .populate('config');

        const subSubject = await subjectModel.findOne({
            name: subSubjectName,
        });

        const config = subject?.toJSON().config as SubjectConfigPopulated;
        const { exams } = config;

        if (config) {
            await subjectConfigModel.updateOne({
                id: config._id,
            }, {
                $push: {
                    subSubjects: subSubject?.id,
                    themes: credentials.theme,
                },
                exams: {
                    trainings: credentials.training
                        ? exams.trainings.concat(credentials.training)
                        : exams.trainings,
                    sessions: credentials.session
                        ? exams.sessions.concat(credentials.session)
                        : exams.sessions,
                },
            });
        } else {
            await subjectConfigModel.create({
                subSubjects: subSubject ? [subSubject.id] : [],
                themes: credentials.theme,
                exams: {
                    trainings: credentials.training,
                    sessions: credentials.session,
                },
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

        const testSuite = await testSuiteModel.create({
            path,
            subject: subject?._id,
            subSubject: subSubject?._id,
            answers: answers.map((answer, index) => ({
                answer: answer.answer,
                type: answer.type,
                taskId: index,
            })),
        });

        /** If tasks images exist in credentials upload them to s3 Bucket and create records in database */
        if (tasksImages) {
            await this.uploadImages({
                id: testSuite._id,
                images: tasksImages,
                type: 'TASK',
            });
        }

        /** If explanations images exist in credentials upload them to s3 Bucket and create records in database */
        if (explanationsImages) {
            await this.uploadImages({
                id: testSuite._id,
                images: explanationsImages,
                type: 'EXPLANATION',
            });
        }

        return testSuite as any;
    }

    async testSuite(credentials: IGetTestSuiteCredentials): Promise<TestSuite> {
        /** Destruct credentials object */
        const { subjectId, subSubjectId, ...other } = credentials;

        const testSuite = await testSuiteModel.findOne({
            subject: subjectId,
            subSubject: subSubjectId,
            ...other,
        });

        if (!testSuite) {
            throw new HttpErrors.NotFound('Тесту з таким параметрами не знайдено.');
        }

        return testSuite;
    }

    async uploadImages(credentials: IUploadImagesCredentials): Promise<any> {
        const testSuite = await testSuiteModel
            .findById(credentials.id)
            .populate('images')
            .map((res) => {
                const json: TestSuitePopulated = res?.toJSON();
                json.images = json.images.sort((a, b) => a.taskId - b.taskId);
                return json;
            });

        /** Check is test suite with this id exist */
        if (!testSuite) {
            throw new HttpErrors[400](`Тесту з таким id: ${credentials.id} не знайдено.`);
        }

        console.log(testSuite);

        /** Make test suite snapshot */
        const lastImage = testSuite.images[testSuite.images.length - 1];

        /** Get index of last task */
        const lastTaskIndex = lastImage ? lastImage.taskId + 1 : 1;

        /** Get path of this test suite */
        const path = testSuite.path;
        console.log({ path });

        /** Upload images and get result of uploaded images */
        const data = await Promise.all(credentials.images.map(async (image, index) => {
            const fileName = `${path}/${credentials.type}/${index}_${makeId(16)}.svg`;
            console.log({ fileName });
            await uploadFile({
                file: image,
                path: fileName,
            });

            const createdImage = await testSuiteImageModel.create({
                image: fileName,
                taskId: lastTaskIndex + index,
                type: credentials.type,
            });

            await testSuiteModel.updateOne({
                _id: testSuite._id,
            }, {
                $push: {
                    images: createdImage._id,
                },
            });

            return fileName;
        }));

        return data;
    }

    async getTestSuiteImages({ type, id }: IGetTestSuiteImagesCredentials): Promise<string[]> {
        /** Select test suite images by type from database */
        const testSuite = await testSuiteModel
            .findById(id)
            .populate({
                path: 'images',
            })
            .select('images');

        if (!testSuite) {
            throw new HttpErrors.NotFound('Картинок для тесту з таким id не знайдено!');
        }

        const images: TestSuiteImage[] = testSuite.toJSON().images;

        // const images = await prisma.testSuite({ id }).images({ where: { type }, orderBy: 'taskId_ASC' });

        const currentEndpoint = this.instance.config.CURRENT_ENDPOINT;

        const port = this.instance.config.PORT;
        const host = this.instance.config.HOST;
        const protocol = this.instance.config.PROTOCOL;

        const url = currentEndpoint
            ? `${currentEndpoint}/uploads`
            : `${protocol}://${host}:${port}/uploads`;

        const data = images
            .sort((a, b) => a.taskId - b.taskId)
            .filter(image => image.type === type)
            .map(image => `${url}/${image.image}`);

        return data;
    }
}

export = TestSuiteService;
