/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Access service to generate and verify access tokens.
 */

/** External imports */
import { FastifyInstance } from 'fastify';
import HttpErrors from 'http-errors';
import _ from 'lodash';

/** Application's imports */
import { UserProfile } from './types';

class AccessService {
    instance!: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.instance = fastify;
    }

    async generateToken(userProfile: UserProfile, session: boolean = false): Promise<string> {
        const expiresIn = session
            ? this.instance.config.JWT_SESSION_EXPIRES_IN
            : this.instance.config.JWT_ACCESS_EXPIRES_IN;

        const token = this.instance.jwt.sign(_.omit(userProfile, ['iat', 'exp']), {
            expiresIn: Number(expiresIn),
        });

        return token;
    }

    async verifyToken(token: string): Promise<UserProfile> {
        const userProfile: UserProfile = this.instance.jwt.verify(token);

        if (!userProfile) {
            throw new HttpErrors.Unauthorized('Профіль користувача відсутній.');
        }

        return userProfile;
    }
}

export = AccessService;
