/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Service which handle refresh tokens for jwt auth.
 */

/** External imports */
import { FastifyInstance } from 'fastify';
import { promisify } from 'util';
import HttpErrors from 'http-errors';
import { v4 as uuidv4 } from 'uuid';

/** Application's imports */
import { UserProfile } from "./types";
import { tokenModel } from '../models/token';

class RefreshService {
    instance!: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.instance = fastify;
    }

    async verifyToken(token: string): Promise<UserProfile> {
        const verify = promisify(this.instance.jwt.verify);
        try {
            const userProfile: UserProfile = await verify(token) as UserProfile;

            return userProfile;
        } catch (err) {
            throw new HttpErrors.Unauthorized(err.message);
        }
    }

    async generateToken(userProfile: UserProfile, session: boolean = true): Promise<string> {
        if (!userProfile) {
            throw new HttpErrors.Unauthorized(
                `Помилка генерації токену, профіль користувача відсутній.`,
            );
        }

        const expiresIn = session
            ? Number(this.instance.config.JWT_SESSION_EXPIRES_IN)
            : Number(this.instance.config.JWT_REFRESH_EXPIRES_IN);

        /** Prepare data for token */
        const tokenData = {
            id: userProfile.id,
            email: userProfile.email,
            role: userProfile.role,
            hash: userProfile.hash || uuidv4(),
        };

        try {
            /** Generate token */
            const token = this.instance.jwt.sign(tokenData, {
                expiresIn,
            });

            if (userProfile.hash) {
                /**
                 * If userProfile has property 'hash'
                 * its mean that user already logged in
                 * and in this case just need to update token in db.
                 */
                await tokenModel.updateOne({
                    loginId: userProfile.hash,
                }, {
                    token,
                });

                this.instance.log.debug('updateToken');
            } else {
                /**
                 * If userProfile doesn't have property 'hash'
                 * its mean that user isn't logged in
                 * in this case need to create new record in db.
                 */
                await tokenModel.create({
                    token,
                    loginId: tokenData.hash,
                    user: userProfile.id,
                });

                this.instance.log.debug('createToken');
            }

            return token;
        } catch (err) {
            throw new HttpErrors.Unauthorized(
                `Помилка генерації токену: ${err.message}`,
            );
        }
    }
}

export = RefreshService;
