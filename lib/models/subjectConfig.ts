/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

import { WithTimeStamps } from '.';

export interface SubSubject {
    subject: string;
    themes: string[];
}

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

export const subjectConfigModel: Model<SubjectConfigSchema & Document> =
    model('SubjectConfig', subjectConfigSchema);
