/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

import { WithTimeStamps } from '.';
import { Subject } from './subject';
import { TestSuiteImage } from './testSuiteImage';

export type AnswerType =
    | 'SINGLE'
    | 'RELATIONS'
    | 'TEXT';

export interface Answer {
    taskId: number;
    answer: string[];
    type: AnswerType;
}

export interface TestSuiteSchema extends WithTimeStamps {
    _id: string;
    subject: string;
    subSubject: string;
    theme: string;
    session: string;
    training: string;
    answers: Answer[];
    images: string[];
    path: string;
}

export type TestSuite =
    & TestSuiteSchema
    & Document;

export type TestSuitePopulated =
    & Omit<TestSuite, 'images' | 'subject' | 'subSubject'>
    & {
        images: TestSuiteImage[];
        subject: Subject;
    };

const testSuiteSchema = new Schema<TestSuiteSchema>({
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    subSubject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
    },
    theme: {
        type: String,
    },
    session: {
        type: String,
    },
    training: {
        type: String,
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'TestSuiteImage',
    }],
    answers: [{
        taskId: {
            type: Number,
            required: true,
        },
        answer: [{
            type: String,
            required: true,
        }],
        type: {
            type: String,
            required: true,
        },
    }],
    path: {
        type: String,
        required: true,
    },
}, {
    autoIndex: true,
    timestamps: true,
    collection: 'TestSuite',
});

testSuiteSchema.set('toJSON', {
    virtuals: true,
});

export const testSuiteModel: Model<TestSuiteSchema & Document> =
    model('TestSuite', testSuiteSchema);
