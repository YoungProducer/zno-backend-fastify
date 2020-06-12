/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

export interface TokenSchema {
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
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    autoIndex: true,
    timestamps: true,
});

export const tokenModel: Model<Document & TokenSchema> =
    model('Token', tokenSchema);
