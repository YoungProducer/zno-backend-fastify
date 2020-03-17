/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Service which handles subjects and things related to subject such as create, fetch etc.
 */

/** External imports */
import { FastifyInstance } from 'fastify';
import aws from 'aws-sdk';

/** Application's imports */
import { prisma, Subject } from '../../prisma/generated/prisma-client';
import { ISubjectService } from './types';

class SubjectService implements ISubjectService {
    s3!: AWS.S3;
    instance!: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.instance = fastify;
        this.s3 = new aws.S3({
            accessKeyId: 'AKIAIGBFC5KT3KI5QLCQ',
            secretAccessKey: '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',
            signatureVersion: 'v4',
            region: 'eu-central-1',
        });
    }

    async create(name: string): Promise<Subject> {
        const subject = await prisma.createSubject({ name });

        return subject;
    }

    getImages(subjects: {
        id: string;
        name: string;
        image: string;
    }[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const images = subjects.map(async subject => {
                return await this.s3.getSignedUrlPromise('getObject', {
                    Bucket: this.instance.config.S3_BUCKET,
                    Key: subject.image,
                    Expires: 60,
                });
            });

            resolve(Promise.all(images));
        });
    }

    async subjects(): Promise<{
        id: string;
        name: string;
    }[]> {
        const mode = process.env.NODE_ENV || 'production';
        const currentUrl = process.env.API_ENDPOINT;

        const subjects: any[] = await prisma.subjects({
            where: {
                isSubSubject: false,
            },
        }).$fragment(`fragment SelectName on Subject { id name image }`);

        // const images = await subjects.map(async (subject) => {
        //     return await this.s3.getSignedUrlPromise('getObject', {
        //         Bucket: this.instance.config.S3_BUCKET,
        //         Key: subject.image,
        //         Expires: 60,
        //     });
        // });
        const images = await this.getImages(subjects);

        const mappedSubjects = subjects.map((subject, index) => ({
            ...subject,
            image: images[index],
        }));

        console.log(mappedSubjects);

        return mappedSubjects;
    }
}

export = SubjectService;
