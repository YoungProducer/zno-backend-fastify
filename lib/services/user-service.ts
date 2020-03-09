/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * User service to make authorization and authentication.
 */

/** External imports */
import fastify, { FastifyInstance } from 'fastify';
import HttpErrors from 'http-errors';

/** Application's imports */
import { ISignInCredentials } from '../services/types';
import { User, prisma } from '../../prisma/generated/prisma-client';

class UserService {
    instance!: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.instance = fastify;
    }

    async verifyCredentials(credentials: ISignInCredentials): Promise<Omit<User, 'password'>> {
        /** Find user in data base by email */
        const foundUser = await prisma.user({
            email: credentials.email,
        });

        if (!foundUser) {
            throw new HttpErrors.BadRequest('Користувача з таким емейлом не знайдено.');
        }

        /** Check is password correct */
        const isMatch: boolean = await this.instance.bcryptHasher.comparePasswords(credentials.password, foundUser.password);

        if (!isMatch) {
            throw new HttpErrors.BadRequest('Неправильний пароль');
        }

        /** Delete password from user object */
        delete foundUser.password;

        return foundUser;
    }

    convertToUserProfile(user: Omit<User, 'password'>) {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
}

export = UserService;
