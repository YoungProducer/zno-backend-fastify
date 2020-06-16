/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Service which handles subjects and things related to subject such as create, fetch etc.
 */

/** External imports */
import { FastifyInstance } from 'fastify';
import aws from 'aws-sdk';
import HttpErros from 'http-errors';

/** Application's imports */
import { prisma, Subject } from '../../prisma/generated/prisma-client';
import { ISubjectService, SubjectTypes } from './types';
import { subjectModel, SubjectSchema } from '../models/subject';
import '../models/subjectConfig';

class SubjectService implements ISubjectService {
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

    async create(payload: SubjectTypes.CreatePayload): Promise<SubjectSchema> {
        const subject = await subjectModel.create(payload);

        return subject;
    }

    getImages(subjects: {
        id: string;
        name: string;
        icon: string;
    }[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const images = subjects.map(async subject => {
                return await this.s3.getSignedUrlPromise('getObject', {
                    Bucket: this.instance.config.S3_BUCKET,
                    Key: subject.icon,
                    Expires: 60,
                });
            });

            resolve(Promise.all(images));
        });
    }

    async subjects(subSubjects: boolean): Promise<SubjectSchema[]> {
        const subjects = await subjectModel.find({
            isSubSubject: subSubjects,
        });

        if (subjects) {
            if (!subSubjects) {
                const currentEndpoint = this.instance.config.CURRENT_ENDPOINT;

                const port = this.instance.config.PORT;
                const host = this.instance.config.HOST;
                const protocol = this.instance.config.PROTOCOL;

                const url = currentEndpoint
                    ? `${currentEndpoint}/uploads`
                    : `${protocol}://${host}:${port}/uploads`;

                const subjectsWithValidImages = subjects.map(subject => {
                    const json: SubjectSchema = subject.toJSON();

                    if (json.icon) {
                        return {
                            ...json,
                            image: `${url}/${json.icon}`,
                        };
                    }

                    return json;
                });

                return subjectsWithValidImages;
            }
        }

        return subjects;
    }

    async checkIsSubjectHaveImage(id: string): Promise<string | false> {
        /** Find subject in database */
        const subject = await prisma.subject({ id });

        /** Check is subject exist */
        if (!subject) {
            throw new HttpErros.BadRequest(`Invalid subject id. Subject with id: ${id} doesn't exist.`);
        }

        /** Check is image exist */
        if (subject.image && subject.image !== null) return subject.image;
        return false;
    }

    async deleteImage(imageName: string, id?: string): Promise<string> {
        /** Define delete params */
        const deleteParams = {
            Bucket: this.instance.config.S3_BUCKET,
            Key: imageName,
        };

        await this.s3.deleteObject(deleteParams).promise();

        if (id) {
            await prisma.updateSubject({
                data: {
                    image: null,
                },
                where: {
                    id,
                },
            });
        }

        this.s3.deleteObject(deleteParams, (err, data) => {
            if (err) {
                throw err;
            }
        });

        return imageName;
    }

    async uploadImage(id: string, image: any) {
        const exists = await this.checkIsSubjectHaveImage(id);

        if (exists) {
            await this.deleteImage(exists);
        }

        const uploadParams = {
            Bucket: this.instance.config.S3_BUCKET,
            Body: image.data,
            Key: `subjects-images/${image.name}`,
            ContentType: image.mimetype,
        };

        const data = await this.s3.upload(uploadParams).promise();

        return await prisma.updateSubject({
            where: { id },
            data: { image: data.Key },
        });
    }
}

export = SubjectService;
