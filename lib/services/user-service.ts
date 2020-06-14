/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * User service to make authorization and authentication.
 */

/** External imports */
import { FastifyInstance } from 'fastify';
import HttpErrors from 'http-errors';

/** Application's imports */
import { ISignInCredentials, TValidationError } from '../services/types';
import { userModel, User } from '../models/user';

class UserService {
    instance!: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.instance = fastify;
    }

    async verifyCredentials(
        credentials: Pick<ISignInCredentials, 'password' | 'email'>,
    ): Promise<Omit<User, 'password'>> {
        const errorData: TValidationError = {
            errorFields: [],
            errorMessages: {},
        };

        /** Find user in data base by email */
        const foundUser = await userModel.findOne({
            email: credentials.email,
        });

        if (!foundUser) {
            errorData.errorFields.push('email');
            errorData.errorMessages.email = 'Користувача з таким емейлом не знайдено.';

            throw new HttpErrors.BadRequest(JSON.stringify({
                errorData,
                message: 'Неправильні данні користувача.',
            }));
        }

        /** Check is password correct */
        const isMatch: boolean = await this.instance.bcryptHasher.comparePasswords(credentials.password, foundUser.password);

        if (!isMatch) {
            errorData.errorFields.push('password');
            errorData.errorMessages.password = 'Неправильний пароль.';

            throw new HttpErrors.BadRequest(JSON.stringify({
                errorData,
                message: 'Неправильні данні користувача.',
            }));
        }

        /** Delete password from user object */
        delete foundUser.password;

        return foundUser;
    }

    async isAdmin(email: string): Promise<boolean> {
        const user = await userModel.findOne({ email });

        if (!user) {
            throw new HttpErrors.BadRequest('Користувача з таким емейлом не існує.');
        }

        return user.role === 'ADMIN';
    }

    convertToUserProfile(user: Omit<User, 'password'>) {
        return {
            id: user._id,
            email: user.email,
            role: user.role,
        };
    }
}

export = UserService;
