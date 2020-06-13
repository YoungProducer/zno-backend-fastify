/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

export type AnswerType =
    | 'SINGLE'
    | 'RELATIONS'
    | 'TEXT';

export interface Answer {
    taskId: number;
    answer: string[];
    type: AnswerType;
}

export interface TestSuiteSchema {
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
}, {
    autoIndex: true,
    timestamps: true,
    collection: 'TestSuite',
});

export const testSuiteModel: Model<TestSuiteSchema & Document> =
    model('TestSuite', testSuiteSchema);
