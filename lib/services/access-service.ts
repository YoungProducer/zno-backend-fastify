/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Access service to generate and verify access tokens.
 */

/** External imports */
import { FastifyInstance } from 'fastify';

/** Application's imports */
import { UserProfile } from './types';

class AccessService {
    instance!: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.instance = fastify;
    }

    async generateToken(userProfile: UserProfile): Promise<string> {
        const expiresIn = process.env.JWT_EXPIRES_IN;

        const token = this.instance.jwt.sign(userProfile, {
            expiresIn: Number(expiresIn),
        });

        return token;
    }

    async verifyToken(token: string): Promise<UserProfile> {
        const userProfile: UserProfile = this.instance.jwt.verify(token);

        return userProfile;
    }
}

export = AccessService;
