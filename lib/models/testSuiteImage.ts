/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

import { WithTimeStamps } from '.';

export type ImageType =
    | 'TASK'
    | 'EXPLANATION';

export interface TestSuiteImageSchema extends WithTimeStamps {
    _id: string;
    taskId: number;
    image: string;
    type: ImageType;
}

export type TestSuiteImage =
    & TestSuiteImageSchema
    & Document;

const testSuiteImageSchema = new Schema<TestSuiteImageSchema>({
    taskId: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
}, {
    autoIndex: true,
    timestamps: true,
    collection: 'TestSuiteImage',
});

export const testSuiteImageModel: Model<TestSuiteImageSchema & Document> =
    model('TestSuiteImage', testSuiteImageSchema);
