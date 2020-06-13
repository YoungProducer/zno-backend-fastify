/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

export type UserRole =
    | 'ADMIN'
    | 'DEFAULT_USER';

export interface UserSchema {
    _id: string;
    email: string;
    password: string;
    name?: string;
    lastName?: string;
    emailConfirmed?: boolean;
    role?: UserRole;
    refreshTokens: string[];
}

const userSchema = new Schema<UserSchema>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    emailConfirmed: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: 'DEFAULT_USER',
    },
    refreshTokens: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    autoIndex: true,
    timestamps: true,
    collection: 'User',
});

export const userModel: Model<Document & UserSchema> =
    model('User', userSchema);
