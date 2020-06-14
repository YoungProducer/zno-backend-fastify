/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

import { WithTimeStamps } from '.';

export interface TokenSchema extends WithTimeStamps {
    _id: string;
    token: string;
    loginId?: string;
    user: string[];
}

const tokenSchema = new Schema<TokenSchema>({
    token: {
        type: String,
        required: true,
    },
    loginId: {
        type: String,
        required: false,
        unique: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    autoIndex: true,
    timestamps: true,
    collection: 'Token',
});

export const tokenModel: Model<Document & TokenSchema> =
    model('Token', tokenSchema);
