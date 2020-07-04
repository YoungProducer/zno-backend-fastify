/** External imports */
import { Schema, Model, Document, model } from 'mongoose';

import { WithTimeStamps } from '.';

export type UserRole =
    | 'ADMIN'
    | 'DEFAULT_USER';

export interface UserSchema extends WithTimeStamps {
    _id: string;
    email: string;
    password: string;
    name?: string;
    lastName?: string;
    emailConfirmed?: boolean;
    role: UserRole;
    refreshTokens?: string[];
    toClient: () => ClientUser;
}

export type ClientUser =
    & Omit<UserSchema, '_id' | 'password'>
    & { id: string };

export type User = UserSchema & Document;

const userSchema = new Schema<UserSchema>({
    email: {
        type: String,
        required: true,
        unique: true,
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
        default: [],
    }],
}, {
    autoIndex: true,
    timestamps: true,
    collection: 'User',
});

userSchema.set('toJSON', {
    virtuals: true,
});

userSchema.methods.toClient = function () {
    const user: UserSchema = (this as any).toObject();

    const id = user._id;

    delete user.password;
    delete user._id;

    return { ...user, id };
};

export const userModel: Model<User> =
    model('User', userSchema);
