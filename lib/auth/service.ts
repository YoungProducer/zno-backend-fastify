/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Service which handles auth controller.
 */

/** External imports */
import { FastifyInstance, FastifyRequest } from 'fastify';
import { IncomingMessage } from 'http';
import HttpErrors from 'http-errors';
import _ from 'lodash';

/** Application's imports */
import { UserProfile } from '../services/types';
import { IAuthService, IRefreshReturnData } from './types';

class AuthService implements IAuthService {
    instance!: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.instance = fastify;
    }

    async refresh(req: FastifyRequest<IncomingMessage>): Promise<IRefreshReturnData> {
        /** Extract refresh token from cookies */
        const refreshToken = req.cookies['refreshToken'];

        if (!refreshToken) {
            throw new HttpErrors.Unauthorized('Токен відсутній.');
        }

        const userProfile: UserProfile = await this.instance.refreshService.verifyToken(refreshToken);

        const newAccessToken: string = await this.instance.accessService.generateToken(_.omit(userProfile, 'hash'));

        const newRefreshToken: string = await this.instance.refreshService.generateToken(userProfile);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            userProfile: _.omit(userProfile, 'hash'),
        };
    }
}

export = AuthService;
