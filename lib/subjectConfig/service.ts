/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 11 March 2020
 */

/** External imports */

/** Application's imports */
import { TSubjectConfig } from './types';
import HttpErrors from 'http-errors';
import { subjectModel, SubjectPopulated } from '../models/subject';

class SubjectConfigService {
    async config(id: string): Promise<TSubjectConfig> {
        const subject = await subjectModel
            .findOne({
                _id: id,
            })
            .populate({
                path: 'config',
                populate: {
                    path: 'subject subSubject',
                },
            });

        if (subject) {
            const jsonSubject: SubjectPopulated = subject.toJSON();
            const config = jsonSubject.config;

            if (config) {
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

        throw new HttpErrors.NotFound('Конфігу з таким id предмету не знайдено!');
    }
}

export = SubjectConfigService;
