/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

import { WithTimeStamps } from '.';
import { SubjectConfigPopulated } from './subjectConfig';

export interface SubjectSchema extends WithTimeStamps {
    _id: string;
    name: string;
    isSubSubject: boolean;
    parent?: string;
    image?: string;
    icon?: string;
    config?: string;
}

export type Subject =
    & SubjectSchema
    & Document;

export type SubjectVirtual =
    & Omit<Subject, 'config'>
    & { id: string };

export type SubjectPopulated =
    & SubjectVirtual
    & {
        config: SubjectConfigPopulated;
    };

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

subjectSchema.set('toJSON', {
    virtuals: true,
});

export const subjectModel: Model<SubjectSchema & Document> =
    model('Subject', subjectSchema);
