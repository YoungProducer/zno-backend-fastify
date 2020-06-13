/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

import { WithTimeStamps } from '.';

export type ImageType =
    | 'TASK'
    | 'EXPLANATION';

export interface TestSuiteImageSchema extends WithTimeStamps {
    _id: string;
    taskId: number;
    testSuite: string;
    image: string;
    type: ImageType;
}

const testSuiteImageSchema = new Schema<TestSuiteImageSchema>({
    taskId: {
        type: Number,
        required: true,
    },
    testSuite: {
        type: Schema.Types.ObjectId,
        ref: 'TestSuite',
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
