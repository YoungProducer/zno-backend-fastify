/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Service which handles subjects and things related to subject such as create, fetch etc.
 */

/** External imports */
import { FastifyInstance } from 'fastify';

/** Application's imports */
import { ISubjectService, SubjectTypes } from './types';
import { subjectModel, SubjectSchema } from '../models/subject';
import '../models/subjectConfig';

class SubjectService implements ISubjectService {
    instance!: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.instance = fastify;
    }

    async create(payload: SubjectTypes.CreatePayload): Promise<SubjectSchema> {
        if (payload.isSubSubject) {
            const parent = await subjectModel.findOne({
                name: payload.parent,
            });

            const subject = await subjectModel.create({
                name: payload.name,
                parent: parent?._id,
                isSubSubject: payload.isSubSubject,
            });

            console.log(subject);

            return subject;
        }

        const subject = await subjectModel.create(payload);

        return subject;
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
}

export = SubjectService;
