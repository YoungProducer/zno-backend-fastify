/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 18 March 2020
 *
 * Service which handle all operations with test suites.
 */

/** External imports */
import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import HttpErrors from 'http-errors';
import pick from 'lodash/pick';

/** Application's imports */
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
import { subjectConfigModel, SubjectConfigPopulated, SubSubject } from '../models/subjectConfig';
import { subjectModel } from '../models/subject';

class TestSuiteService {
    instance!: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.instance = fastify;
    }

    async create(credentials: ICreateTestSuiteCredentials): Promise<TestSuite> {
        const { subjectName, subSubjectName, tasksImages, explanationsImages, answers, ...other } = credentials;

        const subject = await subjectModel
            .findOne({
                name: subjectName,
            })
            .populate('config');

        const subSubject = await subjectModel.findOne({
            name: subSubjectName,
        });

        const config = subject?.toJSON().config as SubjectConfigPopulated;

        if (config) {
            const { exams, themes, subSubjects } = config;

            const nonPopulatedSubjects: SubSubject[] = subSubjects
                ? subSubjects.map(sub => ({
                    subject: sub.subject._id,
                    themes: sub.themes,
                }))
                : [];

            let newSubSubjects = nonPopulatedSubjects;

            if (credentials.theme && subSubjectName) {
                const id = mongoose.Types.ObjectId(subSubject?.id);

                const isSubSubjectAlreayExist =
                    nonPopulatedSubjects.findIndex(sub => {
                        const currentId = mongoose.Types.ObjectId(sub.subject);
                        console.log(currentId.equals(id));
                        return currentId.equals(id);
                    }) !== -1;

                if (isSubSubjectAlreayExist) {
                    newSubSubjects = nonPopulatedSubjects.map(sub => {
                        const currentId = mongoose.Types.ObjectId(sub.subject);

                        if (currentId.equals(id)) {
                            return {
                                subject: sub.subject,
                                themes: sub.themes.concat(credentials.theme as string),
                            };
                        }

                        return {
                            subject: sub.subject,
                            themes: sub.themes,
                        };
                    });
                } else {
                    newSubSubjects = nonPopulatedSubjects.concat({
                        subject: subSubject?._id,
                        themes: [credentials.theme],
                    });
                }
            }

            const newThemes = credentials.theme && !subSubjectName
                ? themes.concat(credentials.theme)
                : themes;

            await subjectConfigModel.updateOne({
                _id: config._id,
            }, {
                $set: {
                    subSubjects: newSubSubjects,
                    themes: newThemes,
                    exams: {
                        trainings: credentials.training
                            ? exams.trainings.concat(credentials.training)
                            : exams.trainings,
                        sessions: credentials.session
                            ? exams.sessions.concat(credentials.session)
                            : exams.sessions,
                    },
                },
            });
        } else {
            const createdConfig = await subjectConfigModel.create({
                subject: subject?._id,
                subSubjects: subSubject ? [subSubject.id] : [],
                themes: credentials.theme,
                exams: {
                    trainings: credentials.training,
                    sessions: credentials.session,
                },
            });

            const updated = await subjectModel.updateOne({
                _id: subject?._id,
            }, {
                config: createdConfig._id,
            });
        }

        /** Path where server will store images related to this test suite */
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
            ...pick(credentials, 'theme', 'training', 'session'),
            subject: subject?._id,
            subSubject: subSubject?._id,
            answers: answers.map((answer, index) => ({
                answer: answer.answer,
                type: answer.type,
                taskId: index,
            })),
        });

        /** If tasks images exist in credentials upload them to server and create records in database */
        if (tasksImages) {
            await this.uploadImages({
                id: testSuite._id,
                images: tasksImages,
                type: 'TASK',
            });
        }

        /** If explanations images exist in credentials upload them to server and create records in database */
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
        if (!credentials.images || credentials.images.length < 1) return;

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

        /** Make test suite snapshot */
        const lastImage = testSuite.images[testSuite.images.length - 1];

        /** Get index of last task */
        const lastTaskIndex = lastImage ? lastImage.taskId + 1 : 1;

        /** Get path of this test suite */
        const path = testSuite.path;

        const createData = await Promise.all(credentials.images.map(async (image, index) => {
            const filePath = `${path}/${credentials.type}`;
            const fileName = `${index}_${makeId(16)}.svg`;

            try {
                await uploadFile({
                    fileName,
                    path: filePath,
                    file: image,
                    createDirIfNX: true,
                });

                return {
                    image: `${filePath}/${fileName}`,
                    taskId: lastTaskIndex + index,
                    type: credentials.type,
                };
            } catch (err) {
                throw Error(err);
            }
        }));

        const createdImages = await testSuiteImageModel.create(createData);

        const createdImagesIds: string[] = createdImages.map(image => image._id);

        await testSuiteModel.updateOne({
            _id: testSuite._id,
        }, {
            $push: {
                images: { $each: createdImagesIds },
            },
        });
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
