/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

import { WithTimeStamps } from '.';

export interface SubjectSchema extends WithTimeStamps {
    _id: string;
    name: string;
    isSubSubject: boolean;
    parent: string;
    image: string;
    icon: string;
    config: string;
}

const subjectSchema = new Schema<SubjectSchema>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    isSubSubject: {
        type: Boolean,
        required: false,
        default: false,
    },
    parent: this,
    image: String,
    icon: String,
    config: {
        type: Schema.Types.ObjectId,
        ref: 'SubjectConfig',
    },
}, {
    autoIndex: true,
    timestamps: true,
    collection: 'Subject',
});

export const subjectModel: Model<SubjectSchema & Document> =
    model('Subject', subjectSchema);
