/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Define main types and interfaces related to services.
 */

import { Role } from "../../prisma/generated/prisma-client";

export interface PasswordHasher<T = string> {
    hashPassword(password: T): Promise<string>;
    comparePasswords(providedpass: T, storedPass: T): Promise<boolean>;
}

export interface ISignUpCredentials {
    email: string;
    password: string;
}

export interface ISignInCredentials {
    email: string;
    password: string;
    remember: boolean;
}

export type TValidationError = {
    /**
     * Array of error fields.
     * Example: ['email', 'password'].
     */
    errorFields: string[];
    /**
     * Object with messages for fields.
     * Example: {
     *     email: 'Invalid pattern',
     *     password: 'To short password',
     * }
     */
    errorMessages: {
        [attr: string]: string;
    };
};

export interface UserProfile {
    id: string;
    email: string;
    role: Role;
    /**
     * This field exists only in refresh tokens.
     * It's 'loginId' of each user
     * for cases when user can login from different devices.
     */
    hash?: string;
}
