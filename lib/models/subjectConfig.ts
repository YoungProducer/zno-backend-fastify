/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

import { WithTimeStamps } from '.';
import { SubjectVirtual } from './subject';

export interface SubSubject {
    subject: string;
    themes: string[];
}

export type SubSubjectPopulated =
    & Pick<SubSubject, 'themes'>
    & {
        subject: SubjectVirtual;
    };

export interface Exams {
    trainings: string[];
    sessions: string[];
}

export interface SubjectConfigSchema extends WithTimeStamps {
    _id: string;
    subject: string;
    themes: string[];
    subSubjects: SubSubject[];
    exams: Exams;
}

export type SubjectConfig =
    & SubjectConfigSchema
    & Document;

export type SubjectConfigPopulated =
    & Omit<SubjectConfig, 'subSubjects' | 'subject'>
    & {
        subject: {
            id: string;
            name: string;
        };
        subSubjects: SubSubjectPopulated[]
    };

const subjectConfigSchema = new Schema<SubjectConfigSchema>({
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
    },
    themes: [{
        type: String,
    }],
    subSubjects: [{
        subject: {
            type: Schema.Types.ObjectId,
            ref: 'Subject',
        },
        themes: [{
            type: String,
        }],
    }],
    exams: {
        trainings: [{
            type: String,
        }],
        sessions: [{
            type: String,
        }],
    },
}, {
    autoIndex: true,
    timestamps: true,
    collection: 'SubjectConfig',
});

subjectConfigSchema.set('toJSON', {
    virtuals: true,
});

export const subjectConfigModel: Model<SubjectConfig> =
    model('SubjectConfig', subjectConfigSchema);
